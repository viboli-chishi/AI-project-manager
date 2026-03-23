# AI router — /api/ai/* endpoints for Hindsight-powered LLM features

from fastapi import APIRouter, HTTPException
from app.schemas.task import MeetingLog, GenericResponse
from app.core.memory_utils import log_meeting_to_memory, build_prompt_context
from app.core.memory_client import retrieve_memory, retrieve_all_context
from app.core.llm_client import summarize_meeting, recommend_task_assignments, generate_deadline_reminders

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/meeting/log", response_model=GenericResponse)
def log_meeting(payload: MeetingLog):
    """Summarise a meeting transcript using Hindsight context and store the result."""
    past_context = build_prompt_context(payload.project_id, "meeting summary decisions")
    summary = summarize_meeting(payload.transcript, past_context)
    result = log_meeting_to_memory(payload.project_id, summary)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Meeting logged and summary stored in memory.",
        data={"summary": summary},
    )


@router.get("/meeting/history/{project_id}", response_model=GenericResponse)
def meeting_history(project_id: str):
    """Retrieve all past meeting summaries from Hindsight memory."""
    meetings = retrieve_memory(project_id, "meeting summaries decisions action items")
    return GenericResponse(
        message="Meeting history retrieved.",
        data={"meetings": meetings},
    )


@router.get("/tasks/recommend/{project_id}", response_model=GenericResponse)
def recommend_tasks(project_id: str):
    """Generate AI task assignment recommendations using Hindsight context."""
    team_context = retrieve_memory(project_id, "team members names roles")
    task_context = retrieve_memory(project_id, "tasks assignments status deadlines")
    past_context = build_prompt_context(project_id, "task assignments performance roles")
    full_context = (
        past_context
        + "\n\nTeam info from memory:\n" + "\n".join(team_context or ["No team info found."])
        + "\n\nTask info from memory:\n" + "\n".join(task_context or ["No task info found."])
    )
    recommendations = recommend_task_assignments([], [], full_context)
    return GenericResponse(
        message="Task assignment recommendations generated.",
        data={"recommendations": recommendations},
    )


@router.get("/reminders/{project_id}", response_model=GenericResponse)
def get_reminders(project_id: str):
    """Generate smart deadline reminders using Hindsight memory for delay patterns."""
    task_context = retrieve_memory(project_id, "tasks deadlines status delays blockers")
    past_context = build_prompt_context(project_id, "deadlines delays blockers")
    full_context = (
        past_context
        + "\n\nTask deadline info from memory:\n" + "\n".join(task_context or ["No task info found."])
    )
    reminders = generate_deadline_reminders([], full_context)
    return GenericResponse(
        message="Deadline reminders generated.",
        data={"reminders": reminders},
    )


@router.get("/context/{project_id}", response_model=GenericResponse)
def get_context(project_id: str):
    """Return the full raw project memory context from Hindsight."""
    all_memories = retrieve_all_context(project_id)
    return GenericResponse(
        message="Full project memory context retrieved.",
        data={"memories": all_memories},
    )


@router.get("/dashboard/summary/{project_id}", response_model=GenericResponse)
def dashboard_summary(project_id: str):
    """Return KPI summary stats for the dashboard header from Hindsight memory."""
    task_context = retrieve_memory(project_id, "tasks status in_progress done deadlines")
    team_context = retrieve_memory(project_id, "team members roles")
    return GenericResponse(
        message="Dashboard summary retrieved.",
        data={
            "task_memories": task_context,
            "team_memories": team_context,
        },
    )
