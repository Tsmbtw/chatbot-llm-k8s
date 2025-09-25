from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

OLLAMA_URL = "http://ollama-service:11434/api/generate"

class Message(BaseModel):
    text: str

@app.post("/chat")
async def chat(msg: Message):
    payload = {
        "model": "llama2",
        "prompt": msg.text
    }
    r = requests.post(OLLAMA_URL, json=payload, stream=True)

    output = ""
    for line in r.iter_lines():
        if line:
            part = line.decode("utf-8")
            if '"response":"' in part:
                output += part.split('"response":"')[1].split('"')[0]
    return {"response": output.strip()}

