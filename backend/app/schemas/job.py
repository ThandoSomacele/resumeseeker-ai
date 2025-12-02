from pydantic import BaseModel, HttpUrl
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from decimal import Decimal


class JobCreate(BaseModel):
    external_job_id: str
    source: str
    title: str
    company: str
    location: Optional[str] = None
    remote_type: Optional[str] = None
    employment_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: str
    skills_required: Optional[List[str]] = None
    posted_date: Optional[date] = None
    expires_at: Optional[date] = None
    application_url: Optional[str] = None


class JobResponse(BaseModel):
    id: UUID
    external_job_id: str
    source: str
    title: str
    company: str
    location: Optional[str] = None
    remote_type: Optional[str] = None
    employment_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: str
    skills_required: Optional[List[str]] = None
    posted_date: Optional[date] = None
    application_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class JobMatchResponse(BaseModel):
    job: JobResponse
    match_score: Decimal
    match_reasons: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
