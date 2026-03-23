# Load all environment variables and export them as constants for use throughout the app

import os
from dotenv import load_dotenv

# Load .env file from the current working directory
load_dotenv(dotenv_path="../.env")

# Groq API key for authenticating requests to the Groq LLM REST API
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

# Hindsight (Vectorize) API key for authenticating memory read/write requests
HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")

# Base URL for the Hindsight REST API; defaults to the official hosted endpoint
HINDSIGHT_BASE_URL: str = os.getenv(
    "HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io"
)
