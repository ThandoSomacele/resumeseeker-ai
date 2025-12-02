from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserResponse
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile"""
    return current_user


@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user dashboard stats"""
    # Count user's resumes
    resume_count = len(current_user.resumes)

    # Count job matches
    match_count = len(current_user.job_matches)

    # Count interactions
    interactions = current_user.interactions
    applied_count = len([i for i in interactions if i.interaction_type == "applied"])
    saved_count = len([i for i in interactions if i.interaction_type == "saved"])

    return {
        "resumes": resume_count,
        "matches": match_count,
        "applied": applied_count,
        "saved": saved_count
    }
