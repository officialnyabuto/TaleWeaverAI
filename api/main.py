from fastapi import FastAPI, HTTPException
from crewai import Agent, Task, Crew, Process
from typing import Dict, List
import anthropic
import openai
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import json
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation

# Load environment variables
load_dotenv()

app = FastAPI()

# Initialize AI clients
claude_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
stability_client = client.StabilityInference(key=os.getenv("STABILITY_API_KEY"))

# Initialize MongoDB client
mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = mongo_client.african_stories

class StoryAgent:
    def __init__(self, name: str, role: str, goal: str, backstory: str, model: str = "claude-3-sonnet"):
        self.agent = Agent(
            name=name,
            role=role,
            goal=goal,
            backstory=backstory,
            allow_delegation=True,
            llm=self._get_llm(model)
        )
    
    def _get_llm(self, model: str):
        if "claude" in model:
            return lambda x: claude_client.messages.create(
                model=model,
                messages=[{"role": "user", "content": x}]
            ).content
        return lambda x: openai_client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": x}]
        ).choices[0].message.content

class StoryCrewManager:
    def __init__(self):
        self.agents = {
            "narrative_architect": StoryAgent(
                "Narrative Architect",
                "Strategic Storyteller",
                "Create compelling story structures",
                "Expert in crafting engaging narratives for children"
            ),
            "cultural_validator": StoryAgent(
                "Cultural Validator",
                "Cultural Authenticity Expert",
                "Ensure cultural accuracy and representation",
                "Deep knowledge of African cultures and traditions"
            ),
            "character_designer": StoryAgent(
                "Character Designer",
                "Character Development Specialist",
                "Create diverse and engaging characters",
                "Expert in designing memorable characters for children's stories"
            ),
            "plot_strategist": StoryAgent(
                "Plot Strategist",
                "Narrative Flow Expert",
                "Craft engaging plot structures",
                "Specialist in creating compelling story arcs"
            ),
            "worldbuilder": StoryAgent(
                "Worldbuilder",
                "Setting Designer",
                "Create immersive story worlds",
                "Expert in African environments and settings"
            ),
            "dialogue_curator": StoryAgent(
                "Dialogue Curator",
                "Language Specialist",
                "Craft authentic dialogue",
                "Expert in African languages and speech patterns"
            ),
            "educational_integrator": StoryAgent(
                "Educational Integrator",
                "Learning Designer",
                "Embed educational elements",
                "Specialist in educational content for children"
            ),
            "visual_designer": StoryAgent(
                "Visual Designer",
                "Art Director",
                "Design visual elements",
                "Expert in African art styles and illustration"
            ),
            "consistency_architect": StoryAgent(
                "Consistency Architect",
                "Continuity Specialist",
                "Ensure narrative consistency",
                "Expert in maintaining story coherence"
            ),
            "quality_assurance": StoryAgent(
                "Quality Assurance",
                "Review Specialist",
                "Ensure overall quality",
                "Expert in children's literature standards"
            )
        }

    async def generate_illustration(self, prompt: str, style: str):
        if style == "dalle":
            response = openai_client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            return response.data[0].url
        else:  # Stable Diffusion
            response = stability_client.generate(
                prompt=prompt,
                steps=50,
                cfg_scale=8.0,
                width=1024,
                height=1024,
                samples=1
            )
            return response[0].artifacts[0].binary

    async def create_story(self, parameters: Dict):
        # Create sequential tasks for story generation
        tasks = [
            Task(
                description="Generate initial story outline",
                agent=self.agents["narrative_architect"].agent
            ),
            Task(
                description="Validate cultural elements",
                agent=self.agents["cultural_validator"].agent
            ),
            Task(
                description="Design main characters",
                agent=self.agents["character_designer"].agent
            ),
            Task(
                description="Develop plot structure",
                agent=self.agents["plot_strategist"].agent
            ),
            Task(
                description="Create world setting",
                agent=self.agents["worldbuilder"].agent
            ),
            Task(
                description="Write dialogue",
                agent=self.agents["dialogue_curator"].agent
            ),
            Task(
                description="Integrate educational elements",
                agent=self.agents["educational_integrator"].agent
            ),
            Task(
                description="Generate illustration prompts",
                agent=self.agents["visual_designer"].agent
            ),
            Task(
                description="Check consistency",
                agent=self.agents["consistency_architect"].agent
            ),
            Task(
                description="Final quality check",
                agent=self.agents["quality_assurance"].agent
            )
        ]

        crew = Crew(
            agents=[agent.agent for agent in self.agents.values()],
            tasks=tasks,
            process=Process.sequential
        )
        
        story = await crew.kickoff()
        
        # Generate illustrations
        illustration_prompts = self._extract_illustration_prompts(story)
        illustrations = []
        for prompt in illustration_prompts:
            illustration_url = await self.generate_illustration(
                prompt,
                parameters.get("illustration_style", "dalle")
            )
            illustrations.append(illustration_url)
        
        return {
            "story": story,
            "illustrations": illustrations
        }

    def _extract_illustration_prompts(self, story: str) -> List[str]:
        # Extract illustration prompts from the story
        # This is a simplified version - in production, use more sophisticated NLP
        return story.split("[ILLUSTRATION]")[1:]

crew_manager = StoryCrewManager()

@app.post("/api/story/generate")
async def generate_story(parameters: Dict):
    try:
        result = await crew_manager.create_story(parameters)
        
        # Store in MongoDB
        story_id = await db.stories.insert_one({
            "parameters": parameters,
            "story": result["story"],
            "illustrations": result["illustrations"],
            "status": "completed",
            "created_at": datetime.utcnow()
        })
        
        return {
            "status": "success",
            "story_id": str(story_id.inserted_id),
            "story": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/story/{story_id}")
async def get_story(story_id: str):
    story = await db.stories.find_one({"_id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@app.get("/api/story/{story_id}/export/{format}")
async def export_story(story_id: str, format: str):
    story = await db.stories.find_one({"_id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    if format == "pdf":
        # Generate PDF version
        pass
    elif format == "epub":
        # Generate EPUB version
        pass
    
    return {"status": "success", "download_url": "..."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)