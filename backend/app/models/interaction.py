import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class UserJobInteraction(Base):
    __tablename__ = "user_job_interactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    interaction_type = Column(String, nullable=False)  # viewed, liked, disliked, saved, applied, dismissed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="interactions")
    job = relationship("Job", back_populates="interactions")

    def __repr__(self):
        return f"<UserJobInteraction(user_id={self.user_id}, job_id={self.job_id}, type={self.interaction_type})>"


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    preferred_job_titles = Column(ARRAY(String), nullable=True)
    preferred_locations = Column(ARRAY(String), nullable=True)
    preferred_industries = Column(ARRAY(String), nullable=True)
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    remote_preference = Column(String, nullable=True)  # remote, hybrid, onsite, any
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="preferences")

    def __repr__(self):
        return f"<UserPreference(user_id={self.user_id})>"
