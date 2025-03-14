from .base import BaseAgent, AgentParameters
from typing import Dict, Any, List

class CharacterDesigner(BaseAgent):
    def __init__(self, parameters: Dict[str, Any] = None):
        super().__init__(
            name="Character Designer",
            role="Character Development Specialist",
            goal="Create diverse and engaging characters",
            backstory="Expert in designing memorable characters for children's stories",
            parameters=AgentParameters(**(parameters or {}))
        )

    async def design_characters(
        self,
        character_type: str,
        diversity_options: List[str],
        story_context: str
    ) -> Dict[str, Any]:
        task = self.agent.create_task(
            description=f"""
            Design story characters with:
            - Character Type: {character_type}
            - Diversity Options: {', '.join(diversity_options)}
            - Story Context: {story_context}
            
            For each character provide:
            1. Name and role
            2. Physical description
            3. Personality traits
            4. Background story
            5. Character arc
            6. Relationships with other characters
            """
        )
        return await self.execute_task(task)