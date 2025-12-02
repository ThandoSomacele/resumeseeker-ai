from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID


class ResumeCreate(BaseModel):
    pass  # File will be uploaded separately


class ResumeUpdate(BaseModel):
    skills: Optional[List[str]] = None


class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    file_path: str
    raw_text: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    skills: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
