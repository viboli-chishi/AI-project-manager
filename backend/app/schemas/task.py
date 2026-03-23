# Pydantic schemas for task-related requests and responses

from typing import Optional
from pydantic import BaseModel


class Task(BaseModel):
    id: str
    title: str
    assigned_to: str          # member id
    status: str               # "todo" | "in_progress" | "done"
    deadline: str             # ISO date string e.g. "2024-04-15"
    progress: Optional[int] = 0       # 0-100
    priority: Optional[str] = "low"   # "high" | "low"
    total_time: Optional[str] = "0h"  # e.g. "12h"


class TaskUpdateRequest(BaseModel):
    project_id: str
    task: Task


class DecisionLog(BaseModel):
    project_id: str
    decision: str


class MeetingLog(BaseModel):
    project_id: str
    transcript: str
    attendees: list[str]


class GenericResponse(BaseModel):
    message: str
    data: Optional[dict] = None
