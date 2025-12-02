# ResumeSeeker.ai

AI-powered job matching platform that finds perfect job opportunities based on your resume.

## Features

- **Smart Resume Parsing**: Upload your CV and our AI extracts skills, experience, and education
- **Semantic Job Matching**: AI finds jobs that truly match your profile using advanced embeddings
- **Personalized Recommendations**: System learns from your preferences and improves over time
- **Auto Job Scraping**: Constantly updated database of job listings from multiple sources
- **Intuitive Dashboard**: Browse, filter, and interact with matched jobs

## Tech Stack

- **Frontend**: SvelteKit with TypeScript, TailwindCSS, Svelte 5
- **Backend**: Python FastAPI with async support
- **Database**: PostgreSQL with pgvector for semantic search
- **Cache/Queue**: Redis with Celery for background jobs
- **AI/ML**: sentence-transformers, spaCy, scikit-learn
- **Deployment**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 20+ (for local development)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd resumejob
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development Setup

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
resumejob/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── scrapers/    # Job scrapers
│   │   ├── ml/          # ML models
│   │   └── workers/     # Celery tasks
│   └── alembic/         # Database migrations
├── frontend/            # SvelteKit frontend
│   └── src/
│       ├── lib/         # Components and utilities
│       └── routes/      # Application pages
└── docker-compose.yml   # Docker services
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://resumeuser:resumepass123@localhost:5432/resumeseeker

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Job API Keys (optional)
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-app-key
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Workflow

### Running Tests

Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm run test
npm run test:e2e
```

### Database Migrations

Create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "Description"
```

Apply migrations:
```bash
alembic upgrade head
```

### Code Quality

```bash
# Backend
black backend/
flake8 backend/
mypy backend/

# Frontend
npm run lint
npm run format
```

## Deployment

See the deployment guide in `docs/deployment.md` for production setup instructions.

## License

MIT License

## Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for guidelines.
