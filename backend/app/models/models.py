import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    oa_location = Column(String, nullable=True)
    oa_grade = Column(Integer, nullable=True)
    comorbidities = Column(ARRAY(String), nullable=True)
    role = Column(String, nullable=False, default="patient")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    exercise_logs = relationship("ExerciseLog", back_populates="user", cascade="all, delete-orphan")
    pain_diary = relationship("PainDiary", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("oa_grade BETWEEN 1 AND 4", name="check_users_oa_grade_range"),
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    level = Column(String, nullable=False)
    target_area = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(ARRAY(Text), nullable=True)
    sets = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    hold_seconds = Column(Integer, nullable=True)
    precautions = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    exercise_logs = relationship("ExerciseLog", back_populates="exercise")


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(UUID(as_uuid=True), ForeignKey("exercises.id"), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    sets_done = Column(Integer, nullable=True)
    reps_done = Column(Integer, nullable=True)
    pain_before = Column(Integer, nullable=True)
    pain_after = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="exercise_logs")
    exercise = relationship("Exercise", back_populates="exercise_logs")

    __table_args__ = (
        CheckConstraint("pain_before BETWEEN 0 AND 10", name="check_exercise_logs_pain_before_range"),
        CheckConstraint("pain_after BETWEEN 0 AND 10", name="check_exercise_logs_pain_after_range"),
    )


class PainDiary(Base):
    __tablename__ = "pain_diary"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    pain_score = Column(Integer, nullable=False)
    stiffness_score = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="pain_diary")

    __table_args__ = (
        CheckConstraint("pain_score BETWEEN 0 AND 10", name="check_pain_diary_pain_score_range"),
        CheckConstraint("stiffness_score BETWEEN 0 AND 10", name="check_pain_diary_stiffness_score_range"),
    )


class ExerciseStatus(Base):
    __tablename__ = "exercise_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(UUID(as_uuid=True), ForeignKey("exercises.id"), nullable=False)
    status = Column(String(20), default="not_started")
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = Column(Text, nullable=True)

    user = relationship("User", backref="exercise_statuses")
    exercise = relationship("Exercise", backref="user_statuses")

    __table_args__ = (
        UniqueConstraint('user_id', 'exercise_id', name='uq_user_exercise_status'),
    )
