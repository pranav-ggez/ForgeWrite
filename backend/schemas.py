from pydantic import BaseModel, Field
from enum import Enum
from typing import Any, List, Union


class IntentType(str, Enum):
    DOMAIN_KNOWLEDGE = "DOMAIN_KNOWLEDGE"
    PERSONA = "PERSONA"
    TASK = "TASK"


class UserInput(BaseModel):
    user_input: str = Field(..., min_length=2, max_length=300)


# PERSONA schema
class PersonaIntent(BaseModel):
    role: str
    audience: str
    expertise_level: str
    behavior: str
    tone: str
    output_style: str
    constraints: Union[str, List[str]]
    task: str

class FlexibleIntent(BaseModel):
    data: Any
