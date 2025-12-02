from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import init_db
from .api import auth, users, resumes, jobs


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Startup
    print("🚀 Starting ResumeSeeker.ai API...")
    # Database will be initialized via migrations
    yield
    # Shutdown
    print("👋 Shutting down ResumeSeeker.ai API...")


# Create FastAPI application
app = FastAPI(
    title="ResumeSeeker.ai API",
    description="AI-powered job matching platform API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resumes.router)
app.include_router(jobs.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ResumeSeeker.ai API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
