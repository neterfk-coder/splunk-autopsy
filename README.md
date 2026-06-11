# Splunk Autopsy

> Your Splunk data knows why sales dropped. Autopsy finds out.

AI-powered causal reasoning agent that translates business failures into root cause reports — automatically.

## What it does

Ask a plain-language business question like:
> *"Why did conversions drop 40% on Tuesday between 2pm and 6pm?"*

Splunk Autopsy launches a multi-step AI agent that:
1. Decomposes the question into investigative hypotheses
2. Executes parallel SPL queries via Splunk MCP Server
3. Builds a causal chain from technical events to business impact
4. Generates a structured Autopsy Report with timeline, root cause, and dollar impact

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS + React Flow |
| Backend | FastAPI + Python 3.11 |
| AI Agent | Claude API (Anthropic) |
| Data platform | Splunk Enterprise |
| Splunk integration | Splunk SDK + MCP Server |
| Database | Supabase (PostgreSQL) |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

## Project Structure

```
splunk-autopsy/
├── frontend/          # React app
├── backend/           # FastAPI + AI agent
├── data/              # Sample datasets
├── docs/              # Architecture diagram
└── docker-compose.yml
```

## Quick Start

See [Setup & Installation](#setup--installation) below.

---

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Splunk Enterprise (free trial)
- Anthropic API key
- Supabase project

### 1. Clone

```bash
git clone https://github.com/your-username/splunk-autopsy.git
cd splunk-autopsy
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your credentials (see `.env.example`).

### 3. Run with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### 4. Load sample data

```bash
cd data
python load_sample_data.py
```

---

## Usage

1. Open http://localhost:5173
2. Type a business question in the search bar
3. Watch the agent build the causal chain in real time
4. Download the Autopsy Report

---

## Architecture

See [`architecture_diagram.png`](./architecture_diagram.png)

---

## License

MIT License
