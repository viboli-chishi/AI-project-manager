# Pydantic models defining all request/response data shapes used across the API

from typing import Optional
from pydantic import BaseModel


# Represents a single team member with their role in the project
class TeamMember(BaseModel):
    id: str
    name: str
    role: str


# Represents a project task with its assignment, status, and deadline
class Task(BaseModel):
    id: str
    title: str
    assigned_to: str
    status: str
    deadline: str


# Represents a meeting log submitted for summarization and storage
class MeetingLog(BaseModel):
    project_id: str
    transcript: str
    attendees: list[str]


# Represents a request to initialize a new project with its team
class ProjectInit(BaseModel):
    project_id: str
    team: list[TeamMember]


# Represents a request to update a specific task's status or details
class TaskUpdateRequest(BaseModel):
    project_id: str
    task: Task


# Generic API response envelope used for all route responses
class GenericResponse(BaseModel):
    message: str
    data: Optional[dict] = None
