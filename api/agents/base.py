from typing import Dict, Any, Optional
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential
from crewai import Agent, Task
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentParameters(BaseModel):
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0

class BaseAgent:
    def __init__(
        self,
        name: str,
        role: str,
        goal: str,
        backstory: str,
        parameters: AgentParameters = AgentParameters()
    ):
        self.name = name
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.parameters = parameters
        self.agent = self._create_agent()

    def _create_agent(self) -> Agent:
        try:
            return Agent(
                name=self.name,
                role=self.role,
                goal=self.goal,
                backstory=self.backstory,
                allow_delegation=True,
                llm_config={
                    "temperature": self.parameters.temperature,
                    "max_tokens": self.parameters.max_tokens,
                    "top_p": self.parameters.top_p,
                    "frequency_penalty": self.parameters.frequency_penalty,
                    "presence_penalty": self.parameters.presence_penalty,
                }
            )
        except Exception as e:
            logger.error(f"Error creating agent {self.name}: {str(e)}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def execute_task(self, task: Task) -> Dict[str, Any]:
        try:
            logger.info(f"Agent {self.name} executing task: {task.description}")
            result = await self.agent.execute(task)
            logger.info(f"Agent {self.name} completed task successfully")
            return {"status": "success", "result": result}
        except Exception as e:
            logger.error(f"Error executing task with agent {self.name}: {str(e)}")
            raise