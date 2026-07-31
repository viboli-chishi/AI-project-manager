# 🤖AI Group Project Manager

An AI-powered project management tool that helps teams track tasks, summarize meetings, and get intelligent recommendations — all backed by semantic memory for context-aware AI responses.

## Features

- **AI Meeting Summarization** — Paste a meeting transcript and get an AI-generated summary with key decisions, action items, and blockers
- **Smart Task Recommendations** — AI analyzes team roles, workload, and past performance to suggest optimal task assignments
- **Deadline Reminders** — Intelligent reminders that learn from past delay patterns to flag at-risk tasks
- **Task Management** — Create, update, and track tasks with priorities, deadlines, and progress
- **Team Management** — Initialize projects with team members and roles
- **Decision Logging** — Record key project decisions to maintain institutional memory
- **Semantic Memory** — All project context is stored as vector embeddings for context-aware AI retrieval

## Tech Stack

### Backend
- **FastAPI** — Python REST API framework with automatic OpenAPI docs
- **Pydantic** — Request/response validation with type-safe schemas
- **Groq API** — LLM inference (OpenAI-compatible) with primary/fallback model pattern
- **Hindsight (Vectorize)** — Vector memory service for semantic storage and retrieval

### Frontend
- **React 19** — UI library with component-based architecture
- **Vite** — Fast build tool and dev server
- **React Router** — Client-side routing
- **React Query** — Server state management and caching
- **Axios** — HTTP client for API requests

### Database
- **Supabase (PostgreSQL)** — Managed database with Row Level Security
- **Hindsight** — Vector database for AI memory persistence

## 📁 Project Structure

```
AI-project-manager/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point, router registration
│   │   ├── routers/
│   │   │   ├── ai.py            # AI endpoints (meeting summary, recommendations, reminders)
│   │   │   ├── tasks.py         # Task CRUD endpoints
│   │   │   └── members.py       # Team member endpoints
│   │   ├── schemas/
│   │   │   ├── task.py          # Pydantic models for tasks, meetings, decisions
│   │   │   └── member.py        # Pydantic models for team members
│   │   └── core/
│   │       ├── config.py        # Environment variable loading
│   │       ├── llm_client.py    # Groq LLM API wrapper
│   │       ├── memory_client.py # Hindsight SDK wrapper
│   │       └── memory_utils.py  # Memory formatting helpers
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page-level components
│   │   ├── services/            # API service layer
│   │   ├── contexts/            # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # Layout components
│   │   ├── styles/              # CSS stylesheets
│   │   ├── lib/                 # Utility libraries
│   │   ├── App.jsx              # Root app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
└── supabase_schema.sql          # Database schema with RLS policies
```

## 🚀Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Groq API Key](https://groq.com/)
- [Hindsight API Key](https://ui.hindsight.vectorize.io)
- [Supabase Project](https://supabase.com/)

### 1. Set Up the Database

Run the SQL schema in your Supabase project:

1. Go to your Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the contents of `supabase_schema.sql` and execute

### 2. Set Up the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 📡 API Endpoints

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/members/init` | Initialize a project with team members |
| `GET` | `/api/members/{project_id}` | Get all team members |
| `GET` | `/api/members/{project_id}/tasks` | Get tasks for a team |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks/` | Create a new task |
| `PUT` | `/api/tasks/{task_id}` | Update an existing task |
| `GET` | `/api/tasks/active/{project_id}` | Get all active tasks |
| `POST` | `/api/tasks/decision` | Log a project decision |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/meeting/log` | Summarize and store a meeting |
| `GET` | `/api/ai/meeting/history/{project_id}` | Get past meeting summaries |
| `GET` | `/api/ai/tasks/recommend/{project_id}` | Get AI task recommendations |
| `GET` | `/api/ai/reminders/{project_id}` | Get smart deadline reminders |
| `GET` | `/api/ai/context/{project_id}` | Get full project memory context |
| `GET` | `/api/ai/dashboard/summary/{project_id}` | Get dashboard KPI summary |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |

## ⚙️ Environment Variables

```env
# Groq API key for LLM inference
GROQ_API_KEY=your_groq_api_key_here

# Hindsight API key for vector memory
HINDSIGHT_API_KEY=your_hindsight_api_key_here

# Hindsight base URL (default: hosted endpoint)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
```

## Architecture

```
┌─────────────┐     HTTP      ┌──────────────────┐
│   React UI  │ ◄───────────► │   FastAPI Backend │
│   (Vite)    │               │                  │
└──────┬──────┘               └───────┬──────────┘
       │                              │
       │ Supabase JS SDK         ┌────┴────┐
       │                         │         │
       ▼                         ▼         ▼
┌─────────────┐          ┌──────────┐ ┌─────────┐
│  Supabase   │          │ Hindsight│ │ Groq    │
│  (Postgres) │          │ (Vector  │ │ (LLM    │
│             │          │  Memory) │ │  API)   │
└─────────────┘          └──────────┘ └─────────┘
```

## 📄 License

This project is for educational purposes.
