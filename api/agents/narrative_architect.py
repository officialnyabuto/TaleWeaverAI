from .base import BaseAgent, AgentParameters
from typing import Dict, Any

class NarrativeArchitect(BaseAgent):
    def __init__(self, parameters: Dict[str, Any] = None):
        super().__init__(
            name="Narrative Architect",
            role="Strategic Storyteller",
            goal="Create compelling story structures",
            backstory="Expert in crafting engaging narratives for children",
            parameters=AgentParameters(**(parameters or {}))
        )

    async def generate_outline(self, theme: str, age_group: str, tone: str) -> Dict[str, Any]:
        task = self.agent.create_task(
            description=f"""
            Create a story outline with:
            - Theme: {theme}
            - Age Group: {age_group}
            - Tone: {tone}
            
            Provide:
            1. Story premise
            2. Main plot points
            3. Character arcs
            4. Key scenes
            """
        )
        return await self.execute_task(task)