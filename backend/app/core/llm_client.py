# Groq LLM client — all AI inference via Groq's OpenAI-compatible REST API using requests

import requests
from app.core.config import GROQ_API_KEY

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
PRIMARY_MODEL = "openai/gpt-oss-120b"
FALLBACK_MODEL = "openai/gpt-oss-20b"

SAFE_FALLBACK = "AI assistant is temporarily unavailable. Please try again shortly."


def _get_headers() -> dict:
    return {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }


def _call_groq(messages: list, model: str = PRIMARY_MODEL) -> str:
    payload = {"model": model, "messages": messages}
    try:
        response = requests.post(
            f"{GROQ_BASE_URL}/chat/completions",
            json=payload,
            headers=_get_headers(),
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception:
        if model == PRIMARY_MODEL:
            try:
                payload["model"] = FALLBACK_MODEL
                response = requests.post(
                    f"{GROQ_BASE_URL}/chat/completions",
                    json=payload,
                    headers=_get_headers(),
                    timeout=30,
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception:
                return SAFE_FALLBACK
        return SAFE_FALLBACK


def summarize_meeting(transcript: str, past_context: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI project manager assistant.\n\n"
                "Past project context from memory:\n"
                f"{past_context}\n\n"
                "Using the above context for continuity, summarize the meeting below. "
                "Think step by step before providing your final summary. "
                "Highlight key decisions, action items, blockers, and any follow-ups."
            ),
        },
        {"role": "user", "content": f"Meeting transcript:\n{transcript}"},
    ]
    return _call_groq(messages)


def recommend_task_assignments(team: list, tasks: list, past_context: str) -> str:
    team_text = (
        "\n".join([f"- {m['name']} ({m['role']}, id: {m['id']})" for m in team])
        if team else "(See project context above for team details)"
    )
    tasks_text = (
        "\n".join(
            [f"- [{t['id']}] {t['title']} | status: {t['status']} | deadline: {t['deadline']}" for t in tasks]
        )
        if tasks else "(See project context above for task details)"
    )
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI project manager assistant.\n\n"
                "Past project context from memory:\n"
                f"{past_context}\n\n"
                "Using past performance patterns, availability, and roles visible in the context above, "
                "recommend the best team member for each unassigned or reassignable task. "
                "Think step by step, justify each recommendation, then provide a clear final list."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Team members:\n{team_text}\n\n"
                f"Tasks:\n{tasks_text}\n\n"
                "Who should own each task, and why?"
            ),
        },
    ]
    return _call_groq(messages)


def generate_deadline_reminders(tasks: list, past_context: str) -> str:
    tasks_text = (
        "\n".join(
            [
                f"- [{t['id']}] {t['title']} | assigned to: {t['assigned_to']} "
                f"| status: {t['status']} | deadline: {t['deadline']}"
                for t in tasks
            ]
        )
        if tasks else "(See project context above for task details)"
    )
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI project manager assistant.\n\n"
                "Past project context from memory:\n"
                f"{past_context}\n\n"
                "Analyse past delay patterns from the context above to generate targeted, "
                "actionable deadline reminders. Think step by step about which tasks are at risk "
                "before writing the final reminder messages."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Current tasks:\n{tasks_text}\n\n"
                "Generate smart deadline reminders for the team."
            ),
        },
    ]
    return _call_groq(messages)
