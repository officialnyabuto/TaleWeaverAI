import logging
from typing import Dict, Any, List
import openai
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from PIL import Image
import io
import os
from tenacity import retry, stop_after_attempt, wait_exponential

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImageGenerator:
    def __init__(self, openai_client: openai.OpenAI, stability_client: client.StabilityInference):
        self.openai_client = openai_client
        self.stability_client = stability_client

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def generate_dalle(self, prompt: str, style: Dict[str, Any]) -> str:
        try:
            response = await self.openai_client.images.generate(
                model="dall-e-3",
                prompt=self._enhance_prompt(prompt, style),
                size="1024x1024",
                quality="standard",
                n=1
            )
            return response.data[0].url
        except Exception as e:
            logger.error(f"DALL-E generation error: {str(e)}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def generate_stable_diffusion(self, prompt: str, style: Dict[str, Any]) -> bytes:
        try:
            response = self.stability_client.generate(
                prompt=self._enhance_prompt(prompt, style),
                steps=50,
                cfg_scale=8.0,
                width=1024,
                height=1024,
                samples=1,
                sampler=generation.SAMPLER_K_DPMPP_2M
            )
            return response[0].artifacts[0].binary
        except Exception as e:
            logger.error(f"Stable Diffusion generation error: {str(e)}")
            raise

    def _enhance_prompt(self, prompt: str, style: Dict[str, Any]) -> str:
        style_desc = f"""
        Style: {style.get('style', 'Traditional African Art')},
        Color Palette: {style.get('palette', 'Warm & Vibrant')},
        Detail Level: {style.get('detail', 'Detailed')},
        Cultural Elements: {style.get('cultural_elements', 'Traditional African patterns and symbols')}
        """
        return f"{prompt}\n\nArtistic Style: {style_desc}"

    async def generate_illustration(
        self,
        prompt: str,
        style: Dict[str, Any],
        engine: str = "dalle"
    ) -> str:
        try:
            if engine == "dalle":
                return await self.generate_dalle(prompt, style)
            else:
                image_data = await self.generate_stable_diffusion(prompt, style)
                # Convert binary data to image and optimize
                image = Image.open(io.BytesIO(image_data))
                image = self._optimize_image(image)
                # Save to temporary file and return path
                temp_path = f"temp/illustration_{hash(prompt)}.png"
                os.makedirs(os.path.dirname(temp_path), exist_ok=True)
                image.save(temp_path, "PNG", optimize=True)
                return temp_path
        except Exception as e:
            logger.error(f"Illustration generation error: {str(e)}")
            raise

    def _optimize_image(self, image: Image.Image) -> Image.Image:
        # Resize if too large
        max_size = 1024
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        return image