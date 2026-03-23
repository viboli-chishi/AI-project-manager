# FastAPI app entry point — registers routers and enables CORS for the React dev server

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import members, tasks, ai

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(title="AI Group Project Manager", version="2.0.0")

# Allow requests from the Vite dev server and any deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(members.router)
app.include_router(tasks.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
