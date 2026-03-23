# Pydantic schemas for member-related requests and responses

from typing import Optional
from pydantic import BaseModel


class TeamMember(BaseModel):
    id: str
    name: str
    role: str
    avatar: Optional[str] = None          # URL or initials fallback
    monthly_activity: Optional[int] = 0   # % of tasks active this month
    in_progress: Optional[int] = 0        # number of tasks in progress
    overtime: Optional[int] = 0           # hours over standard this month
    plan_completion: Optional[int] = 0    # % plan completion
    extra_goals: Optional[int] = 0        # % extra goals achieved
    projects_done: Optional[int] = 0      # total projects completed
    kpi_progress: Optional[int] = 0       # KPI percentage


class ProjectInit(BaseModel):
    project_id: str
    team: list[TeamMember]


class GenericResponse(BaseModel):
    message: str
    data: Optional[dict] = None
