# HiMax AI Coach – AMD Developer Cloud & Google Gemma

## Overview

This folder demonstrates how HiMax AI Coach uses Google Gemma running on AMD Developer Cloud for AI inference.

The notebook and FastAPI backend were used to load and run the Gemma 3-1B-Instruct model on AMD GPU resources as part of the AMD Developer Hackathon (Track 3).

---

## Model

- Model: Google Gemma 3-1B-Instruct
- Framework: Hugging Face Transformers
- Backend: FastAPI
- Inference: PyTorch
- Hardware: AMD Developer Cloud GPU

---

## Folder Structure

```
amd/
├── app.py                 # FastAPI inference server
├── inference_demo.ipynb   # AMD Jupyter Notebook demonstration
├── requirements.txt       # Python dependencies
└── README.md
```

---

## What this demonstrates

This implementation shows:

- Loading Google Gemma 3-1B-Instruct on AMD Developer Cloud
- Running local AI inference using Hugging Face Transformers
- Creating a FastAPI endpoint for AI responses
- Generating personalized fitness and nutrition recommendations
- Using AMD GPU compute resources for inference

---

## API Endpoint

The FastAPI server exposes:

```
POST /generate
```

Request example:

```json
{
  "prompt": "Create a beginner muscle gain workout."
}
```

Response example:

```json
{
  "response": "..."
}
```

---

## Running the server

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

---

## Notebook

The `inference_demo.ipynb` notebook demonstrates:

- Loading Google Gemma
- Running inference on AMD Developer Cloud
- Generating fitness coaching responses
- Verifying successful model execution

---

## Purpose

This folder serves as the AMD Developer Cloud demonstration for the HiMax AI Coach project submitted to the AMD Developer Hackathon (Track 3).

The production application continues to use the existing application architecture, while this implementation demonstrates successful deployment and inference of Google Gemma on AMD compute resources.