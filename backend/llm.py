import os
import json
from google import genai
from schemas import PersonaIntent, IntentType

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment.")

client = genai.Client(api_key=GEMINI_API_KEY)


# 🔹 RULE-BASED CLASSIFIER (NO LLM CALL)
def classify_intent(user_input: str) -> IntentType:
    text = user_input.lower()

    persona_keywords = ["teacher", "coach", "mentor", "advisor", "tutor"]
    task_keywords = ["write", "create", "generate", "build", "make"]

    if any(word in text for word in persona_keywords):
        return IntentType.PERSONA

    if any(word in text for word in task_keywords):
        return IntentType.TASK

    return IntentType.DOMAIN_KNOWLEDGE


# 🔹 PERSONA GENERATOR
def generate_persona_intent(user_input: str) -> PersonaIntent:
    prompt = f"""
Convert this into structured JSON for an expert persona-based AI prompt.

Return ONLY valid JSON with:
- role
- audience
- expertise_level
- behavior
- tone
- output_style
- constraints
- task

All fields must be single strings. 
Do not return arrays or nested objects.

User input:
{user_input}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "temperature": 0,
            "response_mime_type": "application/json"
        }
    )

    return PersonaIntent.model_validate_json(response.text)


# 🔹 DOMAIN GENERATOR
def generate_domain_intent(user_input: str):
    prompt = f"""
Create a structured knowledge prompt for this topic.

Return valid JSON describing:
- topic
- depth_levels
- structure
- key_concepts
- applications
- constraints

User input:
{user_input}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "temperature": 0,
            "response_mime_type": "application/json"
        }
    )

    return json.loads(response.text)


# 🔹 TASK GENERATOR
def generate_task_intent(user_input: str):
    prompt = f"""
Create a structured execution prompt.

Return valid JSON describing:
- objective
- target_audience
- format
- tone
- steps
- constraints

User input:
{user_input}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "temperature": 0,
            "response_mime_type": "application/json"
        }
    )

    return json.loads(response.text)
