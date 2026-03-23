# Thin helper layer — formats raw route data into structured memory objects and calls hindsight_client

import json
from app.core.memory_client import store_memory, retrieve_memory


# Log a meeting summary to Hindsight memory under the "meeting" type
def log_meeting_to_memory(project_id: str, summary: str) -> dict:
    content = {"summary": summary}
    return store_memory(project_id, "meeting", content)


# Log a task status change to Hindsight memory under the "task_update" type
def log_task_update_to_memory(project_id: str, task: dict) -> dict:
    content = {
        "task_id": task.get("id"),
        "title": task.get("title"),
        "assigned_to": task.get("assigned_to"),
        "status": task.get("status"),
        "deadline": task.get("deadline"),
        "progress": task.get("progress", 0),
        "priority": task.get("priority", "low"),
    }
    return store_memory(project_id, "task_update", content)


# Log a key project decision to Hindsight memory under the "decision" type
def log_decision_to_memory(project_id: str, decision_text: str) -> dict:
    content = {"decision": decision_text}
    return store_memory(project_id, "decision", content)


# Retrieve semantically relevant memories and format them for LLM system prompt injection
def build_prompt_context(project_id: str, query: str) -> str:
    memories = retrieve_memory(project_id, query)

    if not memories:
        return "No relevant past context found for this project."

    lines = []
    for i, mem in enumerate(memories, start=1):
        if isinstance(mem, dict):
            if "error" in mem:
                continue
            lines.append(f"[{i}] {json.dumps(mem, ensure_ascii=False, separators=(',', ':'))}")
        else:
            lines.append(f"[{i}] {mem}")

    if not lines:
        return "No relevant past context found for this project."

    return "\n".join(lines)
