from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

# Allow React frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later you can restrict to localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_id = "google/gemma-3-1b-it"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_id)

print("Loading model...")
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    # torch_dtype=torch.float16, // <--- For AMD Developer Cloud GPU
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32, 
    device_map="auto"
)

print("Gemma Loaded Successfully!")
model.eval()

SYSTEM_PROMPT = """
You are HiMax AI Coach.

You are an expert certified personal trainer.

You help users with:

- Workout Plans
- Muscle Gain
- Fat Loss
- Nutrition
- Recovery
- Mobility
- Progressive Overload

Rules:

Always answer professionally.

Always use markdown.

Always use headings.

Never reveal reasoning.

Never explain your thinking.

Never output internal notes.

Answer only the user's question.
"""

class PromptRequest(BaseModel):
    prompt: str
    context: dict | None = None


@app.get("/")
def home():
    return {
        "status": "running",
        "model": model_id
    }

@app.post("/generate")
def generate(request: PromptRequest):

    final_prompt = SYSTEM_PROMPT

    if request.context:
        final_prompt += f"\n\nUser Context:\n{request.context}"

    final_prompt += f"\n\nUser:\n{request.prompt}\n\nAssistant:"

    inputs = tokenizer(
        final_prompt,
        return_tensors="pt"
    ).to(model.device)

    with torch.no_grad():
        # outputs = model.generate(      
        #     **inputs,
        #     max_new_tokens=400,
        #     temperature=0.7,
        #     do_sample=True,
        #     top_p=0.9,
        #     repetition_penalty=1.1,
        # )
        outputs = model.generate(
    **inputs,
    max_new_tokens=400,
    temperature=0.7,
    top_p=0.9,
    do_sample=True,
    repetition_penalty=1.1,
    eos_token_id=tokenizer.eos_token_id,
    pad_token_id=tokenizer.eos_token_id,
)

    response = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )

    # Remove the prompt so only the answer is returned
    answer = response.replace(final_prompt, "").strip()

    return {
        "response": answer
    }