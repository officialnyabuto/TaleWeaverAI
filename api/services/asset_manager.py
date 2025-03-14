import logging
from typing import Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import shutil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AssetManager:
    def __init__(self, mongo_client: AsyncIOMotorClient):
        self.db = mongo_client.african_stories
        self.asset_dir = "assets"
        os.makedirs(self.asset_dir, exist_ok=True)

    async def save_illustration(
        self,
        story_id: str,
        illustration_data: bytes,
        metadata: Dict[str, Any]
    ) -> str:
        try:
            # Create story-specific directory
            story_dir = os.path.join(self.asset_dir, str(story_id))
            os.makedirs(story_dir, exist_ok=True)

            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"illustration_{timestamp}.png"
            filepath = os.path.join(story_dir, filename)

            # Save file
            with open(filepath, "wb") as f:
                f.write(illustration_data)

            # Store metadata in database
            await self.db.illustrations.insert_one({
                "story_id": story_id,
                "filename": filename,
                "filepath": filepath,
                "metadata": metadata,
                "created_at": datetime.utcnow()
            })

            return filepath

        except Exception as e:
            logger.error(f"Error saving illustration: {str(e)}")
            raise

    async def get_story_illustrations(self, story_id: str) -> List[Dict[str, Any]]:
        try:
            cursor = self.db.illustrations.find({"story_id": story_id})
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error retrieving illustrations: {str(e)}")
            raise

    async def delete_story_assets(self, story_id: str) -> None:
        try:
            # Delete files
            story_dir = os.path.join(self.asset_dir, str(story_id))
            if os.path.exists(story_dir):
                shutil.rmtree(story_dir)

            # Delete database records
            await self.db.illustrations.delete_many({"story_id": story_id})
        except Exception as e:
            logger.error(f"Error deleting story assets: {str(e)}")
            raise

    async def backup_assets(self, backup_dir: str) -> None:
        try:
            # Create backup directory
            os.makedirs(backup_dir, exist_ok=True)
            
            # Copy all assets
            shutil.copytree(self.asset_dir, backup_dir, dirs_exist_ok=True)
            
            # Backup metadata
            cursor = self.db.illustrations.find({})
            metadata = await cursor.to_list(length=None)
            
            # Store metadata backup
            await self.db.backups.insert_one({
                "type": "illustrations",
                "data": metadata,
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            logger.error(f"Error backing up assets: {str(e)}")
            raise