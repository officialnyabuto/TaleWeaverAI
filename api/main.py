from fastapi import FastAPI, HTTPException
from crewai import Agent, Task, Crew, Process
from typing import Dict, List
import anthropic
import openai
from motor.motor_asyncio import AsyncIOMotorClient
from redis import Redis
from dotenv import load_dotenv
import os
import json
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from services.story_pipeline import StoryPipeline
from services.image_generator import ImageGenerator
from services.asset_manager import AssetManager
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Initialize clients
claude_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
stability_client = client.StabilityInference(key=os.getenv("STABILITY_API_KEY"))
mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
redis_client = Redis(host='localhost', port=6379, db=0)

# Initialize services
image_generator = ImageGenerator(openai_client, stability_client)
asset_manager = AssetManager(mongo_client)
story_pipeline = StoryPipeline(mongo_client, redis_client, image_generator, asset_manager)

@app.post("/api/story/generate")
async def generate_story(parameters: Dict):
    try:
        result = await story_pipeline.generate_story(parameters)
        
        return {
            "status": "success",
            "story_id": str(result["_id"]),
            "story": result
        }
    except Exception as e:
        logger.error(f"Error generating story: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/story/{story_id}")
async def get_story(story_id: str):
    try:
        story = await mongo_client.african_stories.stories.find_one({"_id": story_id})
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
        return story
    except Exception as e:
        logger.error(f"Error retrieving story: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/story/{story_id}/rollback")
async def rollback_story(story_id: str):
    try:
        await story_pipeline.rollback_story(story_id)
        return {"status": "success", "message": "Story rolled back successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error rolling back story: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/story/{story_id}/illustrations")
async def get_story_illustrations(story_id: str):
    try:
        illustrations = await asset_manager.get_story_illustrations(story_id)
        return illustrations
    except Exception as e:
        logger.error(f"Error retrieving illustrations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/story/{story_id}/backup")
async def backup_story_assets(story_id: str):
    try:
        backup_dir = f"backups/story_{story_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        await asset_manager.backup_assets(backup_dir)
        return {"status": "success", "backup_dir": backup_dir}
    except Exception as e:
        logger.error(f"Error backing up assets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    # Create indexes
    db = mongo_client.african_stories
    await db.stories.create_index("created_at")
    await db.stories.create_index([("status", 1), ("created_at", -1)])
    await db.illustrations.create_index([("story_id", 1), ("created_at", -1)])

@app.on_event("shutdown")
async def shutdown_event():
    # Close connections
    mongo_client.close()
    redis_client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)