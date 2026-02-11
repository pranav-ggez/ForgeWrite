from dotenv import load_dotenv
load_dotenv() 

from fastapi import FastAPI, HTTPException
from schemas import UserInput
from llm import generate_intent
from prompt_builder import build_prompt

app = FastAPI(title="ForgeWrite API")


@app.post("/generate")
async def generate_prompt(payload: UserInput):
    try:
        intent = generate_intent(payload.user_input)
        final_prompt = build_prompt(intent)

        return {
            "intent": intent.model_dump(),
            "final_prompt": final_prompt
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
