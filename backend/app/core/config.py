# Load all environment variables for the backend app

import os
from dotenv import load_dotenv

load_dotenv()

# Groq API key for LLM inference
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

# Hindsight API key for memory persistence
HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")

# Hindsight base URL (defaults to hosted endpoint)
HINDSIGHT_BASE_URL: str = os.getenv(
    "HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io"
)
