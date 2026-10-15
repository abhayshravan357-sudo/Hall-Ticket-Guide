# Hall Ticket Guide AI

AI-powered student assistant for SNJB College of Engineering hall ticket procedures and examination guidance.

## Features

- Natural-language chat about hall tickets, exams, and procedures
- Source-linked answers from approved SNJB knowledge base
- Exam day preparation checklist
- Troubleshooting guidance for common issues
- Responsive design for mobile and desktop
- Mock mode for development (no API keys required)

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt --break-system-packages
uvicorn app.main:app --reload --port 8000
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### With Docker

```bash
docker build -t hall-ticket-backend .
docker run -p 8000:8000 --env-file backend/.env hall-ticket-backend
```

## Project Structure

```
hall-ticket-guide-ai/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── styles/        # CSS tokens & globals
│   └── package.json
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── services/      # Business logic
│   │   ├── providers/     # AI providers (mock + real)
│   │   ├── knowledge/     # Knowledge base loader/validator
│   │   └── schemas/       # Pydantic models
│   ├── tests/             # Pytest suite
│   └── requirements.txt
├── data/                  # Knowledge base (JSON)
│   ├── faqs.json
│   ├── sources.json
│   └── procedures.json
├── .github/workflows/     # CI/CD
├── Dockerfile
└── README.md
```

## Configuration

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
APP_ENV=development
AI_PROVIDER=mock           # or "openai" for production
AI_API_KEY=                # Required for hosted AI
AI_MODEL=                  # e.g., gpt-4o-mini
ALLOWED_ORIGINS=http://localhost:5173
MAX_MESSAGE_LENGTH=2000
RATE_LIMIT_PER_MINUTE=10
```

### Frontend Environment Variables

Copy `.env.example` to `.env` in frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/chat` | Chat with assistant |
| GET | `/api/v1/resources` | Official resource links |
| POST | `/api/v1/feedback` | Submit feedback |
| GET | `/api/v1/checklist` | Exam day checklist |

## Knowledge Base

The knowledge base uses JSON files in `data/`:

- **faqs.json** - Approved Q&A with verification status
- **sources.json** - Official source documents with URLs
- **procedures.json** - Step-by-step procedures

All records have `status`: `draft`, `approved`, or `retired`. Only `approved` content is used for definitive answers.

## Testing

### Backend

```bash
cd backend
python3 -m pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm run build  # Type-checks and builds
```

## Deployment

### Frontend → GitHub Pages

1. Enable GitHub Pages in repository settings (source: GitHub Actions)
2. Add `VITE_API_BASE_URL` as a repository variable (production backend URL)
3. Push to `main` branch → workflow deploys automatically

### Backend → Cloud Hosting

Deploy the Docker image to any container platform:

- **Fly.io**: `fly deploy --dockerfile Dockerfile`
- **Render**: Connect repo, use Docker runtime
- **Railway**: Connect repo, auto-detects Dockerfile
- **Google Cloud Run**: `gcloud run deploy --source .`

Set environment variables in the platform dashboard:
- `AI_PROVIDER=openai`
- `AI_API_KEY=<your-key>`
- `AI_MODEL=gpt-4o-mini`
- `ALLOWED_ORIGINS=https://your-github-pages-url`

## Important Notes

⚠️ **This is a demonstration project.** The chatbot:
- Does NOT verify individual student eligibility
- Does NOT connect to university databases
- Uses sample/draft data until verified by SNJB staff
- Must direct students to official sources for critical information

### SNJB Facts Requiring Verification

| Fact | Status |
|------|--------|
| Official hall ticket portal URL | Unverified |
| Current download procedure | Unverified |
| Exam timetable release dates | Unverified |
| Examination form/fee rules | Unverified |
| Correction procedures | Unverified |
| Required documents | Unverified |
| Covered programmes/years | Unverified |

Contact the Examination Cell to verify:
- **Email**: principalcoe@snjb.org
- **Phone**: +91 2556 253750
- **Website**: https://snjb.org/engineering/exam-cell/coe-desk

## License

MIT License - See LICENSE file for details.