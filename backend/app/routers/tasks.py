# Tasks router — /api/tasks CRUD endpoints

from fastapi import APIRouter, HTTPException
from app.schemas.task import Task, TaskUpdateRequest, DecisionLog, GenericResponse
from app.core.memory_utils import log_task_update_to_memory, log_decision_to_memory
from app.core.memory_client import retrieve_memory

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/active/{project_id}", response_model=GenericResponse)
def get_active_tasks(project_id: str):
    """Retrieve all active tasks for a project from Hindsight memory."""
    tasks = retrieve_memory(project_id, "tasks assignments status in_progress deadlines priority")
    return GenericResponse(
        message="Active tasks retrieved.",
        data={"tasks": tasks},
    )


@router.post("/", response_model=GenericResponse)
def create_task(payload: TaskUpdateRequest):
    """Create a new task and store it in Hindsight memory."""
    task_dict = payload.task.model_dump()
    result = log_task_update_to_memory(payload.project_id, task_dict)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Task created and stored in memory.",
        data={"task": task_dict},
    )


@router.put("/{task_id}", response_model=GenericResponse)
def update_task(task_id: str, payload: TaskUpdateRequest):
    """Update an existing task and log the change to Hindsight memory."""
    task_dict = payload.task.model_dump()
    task_dict["id"] = task_id  # ensure the path param wins
    result = log_task_update_to_memory(payload.project_id, task_dict)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Task updated and logged to memory.",
        data={"task": task_dict},
    )


@router.post("/decision", response_model=GenericResponse)
def log_decision(payload: DecisionLog):
    """Log a key project decision to Hindsight memory."""
    result = log_decision_to_memory(payload.project_id, payload.decision)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Decision logged to memory.",
        data={"decision": payload.decision},
    )
