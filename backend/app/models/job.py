import uuid
from sqlalchemy import Column, String, Text, Integer, Boolean, Date, DateTime, ForeignKey, ARRAY, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from ..database import Base
from ..config import settings


class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_job_id = Column(String, unique=True, nullable=False, index=True)
    source = Column(String, nullable=False)  # adzuna, themuse, github, indeed, linkedin
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    remote_type = Column(String, nullable=True)  # remote, hybrid, onsite
    employment_type = Column(String, nullable=True)  # full-time, part-time, contract
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    description = Column(Text, nullable=False)
    embedding = Column(Vector(settings.EMBEDDING_DIMENSION), nullable=True)
    skills_required = Column(ARRAY(String), nullable=True)
    posted_date = Column(Date, nullable=True)
    expires_at = Column(Date, nullable=True)
    application_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    matches = relationship("JobMatch", back_populates="job", cascade="all, delete-orphan")
    interactions = relationship("UserJobInteraction", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job(id={self.id}, title={self.title}, company={self.company})>"


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_score = Column(Numeric(precision=5, scale=4), nullable=False)  # 0.0000 to 1.0000
    match_reasons = Column(JSONB, nullable=True)  # Explanation of match
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="job_matches")
    job = relationship("Job", back_populates="matches")

    def __repr__(self):
        return f"<JobMatch(user_id={self.user_id}, job_id={self.job_id}, score={self.match_score})>"
