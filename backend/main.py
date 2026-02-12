from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import UserInput, IntentType
from llm import (
    classify_intent,
    generate_persona_intent,
    generate_domain_intent,
    generate_task_intent
)
from prompt_builder import build_persona_prompt

app = FastAPI(title="ForgeWrite API")

# Allow local frontend later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 SIMPLE IN-MEMORY CACHE
cache = {}


@app.post("/generate")
async def generate_prompt(payload: UserInput):
    user_input = payload.user_input.strip()

    # Cache check
    if user_input in cache:
        return cache[user_input]

    intent_type = classify_intent(user_input)

    try:
        if intent_type == IntentType.PERSONA:
            intent = generate_persona_intent(user_input)
            final_prompt = build_persona_prompt(intent)

            response = {
                "type": "PERSONA",
                "intent": intent.model_dump(),
                "final_prompt": final_prompt
            }

        elif intent_type == IntentType.DOMAIN_KNOWLEDGE:
            intent = generate_domain_intent(user_input)

            response = {
                "type": "DOMAIN_KNOWLEDGE",
                "intent": intent,
                "final_prompt": intent
            }

        else:
            intent = generate_task_intent(user_input)

            response = {
                "type": "TASK",
                "intent": intent,
                "final_prompt": intent
            }

        # Save to cache
        cache[user_input] = response

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
