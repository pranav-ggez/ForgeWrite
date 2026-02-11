from pydantic import BaseModel, Field


class Intent(BaseModel):
    role: str = Field(..., min_length=3)
    audience: str = Field(..., min_length=3)
    expertise_level: str = Field(..., min_length=3)
    behavior: str = Field(..., min_length=3)
    tone: str = Field(..., min_length=3)
    output_style: str = Field(..., min_length=3)
    constraints: str = Field(..., min_length=3)
    task: str = Field(..., min_length=3)


class UserInput(BaseModel):
    user_input: str = Field(..., min_length=2)
