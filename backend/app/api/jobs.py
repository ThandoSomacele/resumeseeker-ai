from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ..database import get_db
from ..models.user import User
from ..models.job import Job, JobMatch
from ..models.interaction import UserJobInteraction
from ..schemas.job import JobResponse, JobMatchResponse
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/", response_model=List[JobMatchResponse])
async def get_matched_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get matched jobs for the current user"""
    offset = (page - 1) * limit

    # Get job matches
    matches = db.query(JobMatch).filter(
        JobMatch.user_id == current_user.id
    ).order_by(
        JobMatch.match_score.desc()
    ).offset(offset).limit(limit).all()

    # Load jobs
    results = []
    for match in matches:
        job = db.query(Job).filter(Job.id == match.job_id).first()
        if job:
            results.append({
                "job": job,
                "match_score": match.match_score,
                "match_reasons": match.match_reasons
            })

    return results


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job details"""
    job = db.query(Job).filter(Job.id == job_id, Job.is_active == True).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Track view interaction
    interaction = UserJobInteraction(
        user_id=current_user.id,
        job_id=job_id,
        interaction_type="viewed"
    )
    db.add(interaction)
    db.commit()

    return job


@router.post("/{job_id}/interact", status_code=status.HTTP_201_CREATED)
async def interact_with_job(
    job_id: UUID,
    interaction_type: str = Query(..., regex="^(liked|disliked|saved|applied|dismissed)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record user interaction with a job"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Create interaction
    interaction = UserJobInteraction(
        user_id=current_user.id,
        job_id=job_id,
        interaction_type=interaction_type
    )

    db.add(interaction)
    db.commit()

    return {"message": f"Interaction '{interaction_type}' recorded"}


@router.get("/saved/list", response_model=List[JobResponse])
async def get_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved jobs"""
    saved_interactions = db.query(UserJobInteraction).filter(
        UserJobInteraction.user_id == current_user.id,
        UserJobInteraction.interaction_type == "saved"
    ).all()

    job_ids = [i.job_id for i in saved_interactions]
    jobs = db.query(Job).filter(Job.id.in_(job_ids), Job.is_active == True).all()

    return jobs


@router.get("/applied/list", response_model=List[JobResponse])
async def get_applied_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get jobs user has applied to"""
    applied_interactions = db.query(UserJobInteraction).filter(
        UserJobInteraction.user_id == current_user.id,
        UserJobInteraction.interaction_type == "applied"
    ).all()

    job_ids = [i.job_id for i in applied_interactions]
    jobs = db.query(Job).filter(Job.id.in_(job_ids)).all()

    return jobs
