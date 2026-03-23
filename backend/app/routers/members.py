# Members router — /api/members endpoints

from fastapi import APIRouter, HTTPException
from app.schemas.member import TeamMember, ProjectInit, GenericResponse
from app.core.memory_client import store_memory, retrieve_memory

router = APIRouter(prefix="/api/members", tags=["members"])


@router.post("/init", response_model=GenericResponse)
def init_project(payload: ProjectInit):
    """Initialize a project and store all team members in Hindsight memory."""
    team_data = [member.model_dump() for member in payload.team]
    content = {"team": team_data}
    result = store_memory(payload.project_id, "team", content)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return GenericResponse(
        message="Project initialised and team stored in memory.",
        data=result,
    )


@router.get("/{project_id}", response_model=GenericResponse)
def get_members(project_id: str):
    """Retrieve all team members for a project from Hindsight memory."""
    members = retrieve_memory(project_id, "team members names roles stats")
    return GenericResponse(
        message="Team members retrieved.",
        data={"members": members},
    )


@router.get("/{project_id}/tasks", response_model=GenericResponse)
def get_member_tasks(project_id: str):
    """Retrieve all tasks associated with a project's team from Hindsight memory."""
    tasks = retrieve_memory(project_id, "tasks assignments status deadlines")
    return GenericResponse(
        message="Member tasks retrieved.",
        data={"tasks": tasks},
    )
