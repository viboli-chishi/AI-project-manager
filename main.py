# FastAPI application entry point — defines all routes and wires together memory_utils and llm_client

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import ProjectInit, MeetingLog, TaskUpdateRequest, GenericResponse, DecisionLog
from memory_client import store_memory, retrieve_memory, retrieve_all_context
from llm_client import summarize_meeting, recommend_task_assignments, generate_deadline_reminders
from memory_utils import (
    log_meeting_to_memory,
    log_task_update_to_memory,
    log_decision_to_memory,
    build_prompt_context,
)
import logging
logging.basicConfig(level=logging.DEBUG)

# Initialise the FastAPI app instance
app = FastAPI(title="AI Group Project Manager", version="1.0.0")

# Enable CORS for all origins, methods, and headers so any frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# POST /project/init — store the project team and roles in Hindsight to bootstrap project memory
@app.post("/project/init", response_model=GenericResponse)
def init_project(payload: ProjectInit):
    team_data = [member.model_dump() for member in payload.team]
    content = {"team": team_data}
    # HINDSIGHT WRITE
    result = store_memory(payload.project_id, "team", content)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Project initialised and team stored in memory.",
        data=result,
    )


# POST /meeting/log — accept meeting notes, summarise with LLM, then store summary in Hindsight
@app.post("/meeting/log", response_model=GenericResponse)
def log_meeting(payload: MeetingLog):
    past_context = build_prompt_context(payload.project_id, "meeting summary decisions")
    summary = summarize_meeting(payload.transcript, past_context)
    store_result = log_meeting_to_memory(payload.project_id, summary)
    if "error" in store_result:
        raise HTTPException(status_code=500, detail=store_result["error"])
    return GenericResponse(
        message="Meeting logged and summary stored in memory.",
        data={"summary": summary},
    )


# GET /meeting/history/{project_id} — retrieve all past meeting summaries from Hindsight
@app.get("/meeting/history/{project_id}", response_model=GenericResponse)
def meeting_history(project_id: str):
    # HINDSIGHT READ — use a targeted query so Hindsight returns meeting-related memories
    meeting_memories = retrieve_memory(project_id, "meeting summaries decisions action items")
    return GenericResponse(
        message="Meeting history retrieved.",
        data={"meetings": meeting_memories},
    )


# POST /tasks/update — update a task's status and log the change to Hindsight memory
@app.post("/tasks/update", response_model=GenericResponse)
def update_task(payload: TaskUpdateRequest):
    task_dict = payload.task.model_dump()
    store_result = log_task_update_to_memory(payload.project_id, task_dict)
    if "error" in store_result:
        raise HTTPException(status_code=500, detail=store_result["error"])
    return GenericResponse(
        message="Task update logged to memory.",
        data={"task": task_dict},
    )


# POST /decision/log — log a key project decision to Hindsight memory
@app.post("/decision/log", response_model=GenericResponse)
def log_decision(payload: DecisionLog):
    store_result = log_decision_to_memory(payload.project_id, payload.decision)
    if "error" in store_result:
        raise HTTPException(status_code=500, detail=store_result["error"])
    return GenericResponse(
        message="Decision logged to memory.",
        data={"decision": payload.decision},
    )


# GET /tasks/recommend/{project_id} — generate AI task assignment recommendations using Hindsight context
@app.get("/tasks/recommend/{project_id}", response_model=GenericResponse)
def recommend_tasks(project_id: str):
    # HINDSIGHT READ — pull team and task context with targeted queries
    team_context = retrieve_memory(project_id, "team members names roles")
    task_context = retrieve_memory(project_id, "tasks assignments status deadlines")
    past_context = build_prompt_context(project_id, "task assignments performance roles")
    # Combine all recalled context into one string for the LLM
    full_context = (
        past_context
        + "\n\nTeam info from memory:\n" + "\n".join(team_context if team_context else ["No team info found."])
        + "\n\nTask info from memory:\n" + "\n".join(task_context if task_context else ["No task info found."])
    )
    # Let the LLM reason over all the recalled context directly
    recommendations = recommend_task_assignments([], [], full_context)
    return GenericResponse(
        message="Task assignment recommendations generated.",
        data={"recommendations": recommendations},
    )


# GET /reminders/{project_id} — generate smart deadline reminders using Hindsight memory for delay patterns
@app.get("/reminders/{project_id}", response_model=GenericResponse)
def get_reminders(project_id: str):
    # HINDSIGHT READ — pull task and deadline context with a targeted query
    task_context = retrieve_memory(project_id, "tasks deadlines status delays blockers")
    past_context = build_prompt_context(project_id, "deadlines delays blockers")
    full_context = (
        past_context
        + "\n\nTask deadline info from memory:\n" + "\n".join(task_context if task_context else ["No task info found."])
    )
    # Let the LLM reason over all recalled context directly
    reminders = generate_deadline_reminders([], full_context)
    return GenericResponse(
        message="Deadline reminders generated.",
        data={"reminders": reminders},
    )


# GET /context/{project_id} — return the full raw project memory context from Hindsight
@app.get("/context/{project_id}", response_model=GenericResponse)
def get_context(project_id: str):
    # HINDSIGHT READ
    all_memories = retrieve_all_context(project_id)
    return GenericResponse(
        message="Full project memory context retrieved.",
        data={"memories": all_memories},
    )
