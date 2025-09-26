import requests
import json
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://chatbot.local"],   # 🔒 In production, restrict to ["http://chatbot.local"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama service URL inside Kubernetes
OLLAMA_URL = "http://ollama-service:11434/api/generate"


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(payload: dict = Body(...)):
    message = payload.get("message", "").strip()

    if not message:
        return {"answer": "⚠️ Please provide a message."}

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "gemma3:1b",
                "prompt": message,
            },
            stream=True,
            timeout=60,
        )

        full_response = ""
        for line in response.iter_lines():
            if line:
                try:
                    data = line.decode("utf-8")
                    print(f"🔹 Raw Ollama line: {data}")  # log raw line
                    chunk = json.loads(data)
                    if "response" in chunk:
                        full_response += chunk["response"]
                except Exception as e:
                    print(f"⚠️ Skipped line: {e}, content={line}")

        print(f"✅ Final assembled response: {full_response}")
        return {"answer": full_response}

    except Exception as e:
        print(f"❌ Error contacting Ollama: {str(e)}")
        return {"answer": f"Error contacting model: {str(e)}"}

