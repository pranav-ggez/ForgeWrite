import os
from google import genai
from schemas import Intent

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment.")

client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You convert vague user input into structured JSON.

Return ONLY valid JSON with these fields:
- role
- audience
- expertise_level
- behavior
- tone
- output_style
- constraints
- task

Rules:
- Be specific
- Avoid vague adjectives like 'helpful'
- Do not invent certifications or years
- No explanations outside JSON
"""

def generate_intent(user_input: str) -> Intent:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=f"{SYSTEM_PROMPT}\n\nUser input:\n{user_input}",
        config={
            "temperature": 0,
            "response_mime_type": "application/json"
        }
    )

    if not response.text:
        raise ValueError("Empty response from Gemini.")

    return Intent.model_validate_json(response.text)
