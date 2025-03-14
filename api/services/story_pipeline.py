import asyncio
from typing import Dict, Any, List
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from redis import Redis
from agents.narrative_architect import NarrativeArchitect
from agents.cultural_validator import CulturalValidator
from agents.character_designer import CharacterDesigner
from agents.plot_strategist import PlotStrategist
from .image_generator import ImageGenerator
from .asset_manager import AssetManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StoryPipeline:
    def __init__(
        self,
        mongo_client: AsyncIOMotorClient,
        redis_client: Redis,
        image_generator: ImageGenerator,
        asset_manager: AssetManager
    ):
        self.mongo_client = mongo_client
        self.redis_client = redis_client
        self.db = mongo_client.african_stories
        self.image_generator = image_generator
        self.asset_manager = asset_manager
        self.agents = self._initialize_agents()
        
    def _initialize_agents(self) -> Dict[str, Any]:
        return {
            "narrative_architect": NarrativeArchitect(),
            "cultural_validator": CulturalValidator(),
            "character_designer": CharacterDesigner(),
            "plot_strategist": PlotStrategist(),
        }

    async def _cache_result(self, key: str, data: Dict[str, Any], expire: int = 3600) -> None:
        try:
            self.redis_client.setex(key, expire, str(data))
        except Exception as e:
            logger.error(f"Error caching result: {str(e)}")

    async def _get_cached_result(self, key: str) -> Dict[str, Any]:
        try:
            cached = self.redis_client.get(key)
            return eval(cached) if cached else None
        except Exception as e:
            logger.error(f"Error retrieving cached result: {str(e)}")
            return None

    async def generate_story(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Check cache
            cache_key = f"story:{hash(str(parameters))}"
            cached_result = await self._get_cached_result(cache_key)
            if cached_result:
                return cached_result

            # Initialize story document
            story_doc = {
                "parameters": parameters,
                "status": "in_progress",
                "progress": 0,
                "steps": []
            }
            
            # Insert initial document
            result = await self.db.stories.insert_one(story_doc)
            story_id = result.inserted_id

            # Generate outline
            outline = await self.agents["narrative_architect"].generate_outline(
                parameters["theme"],
                parameters["age_group"],
                parameters["tone"]
            )
            
            await self._update_progress(story_id, 20, "outline_generated", outline)

            # Validate cultural elements
            validation = await self.agents["cultural_validator"].validate_content(
                outline["result"],
                parameters["region"],
                parameters["accuracy"]
            )

            await self._update_progress(story_id, 40, "cultural_validated", validation)

            # Design characters
            characters = await self.agents["character_designer"].design_characters(
                parameters["character_type"],
                parameters["diversity_options"],
                outline["result"]
            )

            await self._update_progress(story_id, 60, "characters_designed", characters)

            # Develop plot
            plot = await self.agents["plot_strategist"].develop_plot(
                parameters["complexity"],
                parameters["arc_type"],
                outline["result"],
                characters["result"]
            )

            await self._update_progress(story_id, 80, "plot_developed", plot)

            # Generate illustrations
            illustrations = await self._generate_illustrations(
                story_id,
                plot["result"],
                parameters["illustration_style"]
            )

            # Final story compilation
            final_story = {
                "outline": outline["result"],
                "validation": validation["result"],
                "characters": characters["result"],
                "plot": plot["result"],
                "illustrations": illustrations,
                "status": "completed",
                "progress": 100
            }

            # Update final document
            await self.db.stories.update_one(
                {"_id": story_id},
                {"$set": final_story}
            )

            # Cache result
            await self._cache_result(cache_key, final_story)

            return final_story

        except Exception as e:
            logger.error(f"Error in story generation pipeline: {str(e)}")
            if story_id:
                await self.db.stories.update_one(
                    {"_id": story_id},
                    {
                        "$set": {
                            "status": "failed",
                            "error": str(e)
                        }
                    }
                )
            raise

    async def _update_progress(
        self,
        story_id: str,
        progress: int,
        step: str,
        data: Dict[str, Any]
    ) -> None:
        await self.db.stories.update_one(
            {"_id": story_id},
            {
                "$set": {
                    step: data["result"],
                    "progress": progress,
                },
                "$push": {"steps": step}
            }
        )

    async def _generate_illustrations(
        self,
        story_id: str,
        plot: str,
        style: Dict[str, Any]
    ) -> List[str]:
        illustration_prompts = self._extract_illustration_prompts(plot)
        illustrations = []

        for prompt in illustration_prompts:
            try:
                illustration = await self.image_generator.generate_illustration(
                    prompt,
                    style,
                    engine=style.get("engine", "dalle")
                )
                
                # Save illustration and get filepath
                filepath = await self.asset_manager.save_illustration(
                    story_id,
                    illustration,
                    {"prompt": prompt, "style": style}
                )
                
                illustrations.append(filepath)
            except Exception as e:
                logger.error(f"Error generating illustration: {str(e)}")
                continue

        return illustrations

    def _extract_illustration_prompts(self, plot: str) -> List[str]:
        # Extract key scenes from plot for illustration
        # This is a simplified version - in production, use more sophisticated NLP
        scenes = plot.split("\n\n")
        return [scene for scene in scenes if "Scene:" in scene]

    async def rollback_story(self, story_id: str) -> None:
        try:
            story = await self.db.stories.find_one({"_id": story_id})
            if not story:
                raise ValueError("Story not found")

            # Revert to last successful step
            last_successful_step = story["steps"][-2] if len(story["steps"]) > 1 else None
            
            if last_successful_step:
                # Delete assets from current step
                await self.asset_manager.delete_story_assets(story_id)
                
                await self.db.stories.update_one(
                    {"_id": story_id},
                    {
                        "$set": {
                            "status": "in_progress",
                            "progress": 50,
                            "steps": story["steps"][:-1]
                        }
                    }
                )
            else:
                # If no successful steps, delete the story and its assets
                await self.asset_manager.delete_story_assets(story_id)
                await self.db.stories.delete_one({"_id": story_id})

        except Exception as e:
            logger.error(f"Error rolling back story: {str(e)}")
            raise