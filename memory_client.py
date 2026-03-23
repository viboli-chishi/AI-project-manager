# Hindsight memory client — uses the official hindsight-client SDK for all persistence operations

import json
from hindsight_client import Hindsight
from config import HINDSIGHT_BASE_URL, HINDSIGHT_API_KEY

# Initialise the SDK client once at module level for reuse across all function calls
client = Hindsight(base_url=HINDSIGHT_BASE_URL, api_key=HINDSIGHT_API_KEY)


# Serialise a typed content dict into a readable plain-text string for storage in Hindsight
def _format_content(memory_type: str, content: dict) -> str:
    parts = [f"[{memory_type}]"]
    for key, value in content.items():
        if isinstance(value, (dict, list)):
            parts.append(f"{key}: {json.dumps(value, ensure_ascii=False, separators=(',', ':'))}")
        else:
            parts.append(f"{key}: {value}")
    return " | ".join(parts)


# HINDSIGHT WRITE — store a typed memory object as plain text in the project's memory bank
def store_memory(project_id: str, memory_type: str, content: dict) -> dict:
    try:
        plain_text = _format_content(memory_type, content)
        result = client.retain(bank_id=project_id, content=plain_text)
        # SDK returns None or a response object — normalise to a clean dict
        if result is None:
            return {"status": "stored"}
        return result if isinstance(result, dict) else {"status": "stored", "result": str(result)}
    except Exception as e:
        return {"error": f"store_memory failed: {str(e)}"}


# HINDSIGHT READ — semantically search the project's memory bank and return a list of matching text strings
def retrieve_memory(project_id: str, query: str) -> list:
    try:
        response = client.recall(bank_id=project_id, query=query)
        # response.results is a list of RecallResult objects, each with a .text attribute
        if hasattr(response, "results") and response.results:
            return [r.text for r in response.results if hasattr(r, "text")]
        # Fallback: response itself might be a list
        if isinstance(response, list):
            return [r.text if hasattr(r, "text") else str(r) for r in response]
        return []
    except Exception as e:
        return [{"error": f"retrieve_memory failed: {str(e)}"}]


# HINDSIGHT READ — retrieve all stored context for a project using a broad recall query
def retrieve_all_context(project_id: str) -> list:
    try:
        response = client.recall(bank_id=project_id, query="all project context")
        # response.results is a list of RecallResult objects, each with a .text attribute
        if hasattr(response, "results") and response.results:
            return [r.text for r in response.results if hasattr(r, "text")]
        # Fallback: response itself might be a list
        if isinstance(response, list):
            return [r.text if hasattr(r, "text") else str(r) for r in response]
        return []
    except Exception as e:
        return [{"error": f"retrieve_all_context failed: {str(e)}"}]
