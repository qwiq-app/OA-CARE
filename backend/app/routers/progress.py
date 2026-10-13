from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Exercise, ExerciseLog, PainDiary, User, ExerciseStatus
from app.utils.security import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])


class ExerciseLogRequest(BaseModel):
    exercise_id: UUID
    sets_done: int
    reps_done: int
    pain_before: int = Field(ge=0, le=10)
    pain_after: int = Field(ge=0, le=10)
    notes: Optional[str] = None


class PainDiaryRequest(BaseModel):
    pain_score: int = Field(ge=0, le=10)
    stiffness_score: Optional[int] = Field(default=None, ge=0, le=10)
    location: Optional[str] = None
    notes: Optional[str] = None


class StatusUpdate(BaseModel):
    exercise_id: UUID
    status: str
    notes: Optional[str] = None


@router.post("/log")
def log_exercise(
    request: ExerciseLogRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exercise = db.query(Exercise).filter(Exercise.id == request.exercise_id).first()
    if exercise is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )

    exercise_log = ExerciseLog(
        user_id=current_user.id,
        exercise_id=request.exercise_id,
        completed_at=datetime.utcnow(),
        sets_done=request.sets_done,
        reps_done=request.reps_done,
        pain_before=request.pain_before,
        pain_after=request.pain_after,
        notes=request.notes,
    )
    db.add(exercise_log)
    db.commit()

    return {"message": "Exercise logged successfully"}


@router.get("/logs")
def get_exercise_logs(
    days: int = Query(default=30, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start_date = datetime.utcnow() - timedelta(days=days)
    logs = (
        db.query(ExerciseLog)
        .join(Exercise)
        .filter(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.completed_at >= start_date,
        )
        .order_by(ExerciseLog.completed_at.desc())
        .all()
    )

    return [
        {
            "id": str(log.id),
            "exercise_name": log.exercise.name,
            "target_area": log.exercise.target_area,
            "completed_at": log.completed_at,
            "sets_done": log.sets_done,
            "reps_done": log.reps_done,
            "pain_before": log.pain_before,
            "pain_after": log.pain_after,
        }
        for log in logs
    ]


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.utcnow()
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)

    exercises_this_week = (
        db.query(ExerciseLog)
        .filter(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.completed_at >= week_start,
        )
        .count()
    )
    exercises_this_month = (
        db.query(ExerciseLog)
        .filter(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.completed_at >= month_start,
        )
        .count()
    )
    avg_pain_last_30_days = (
        db.query(func.avg(PainDiary.pain_score))
        .filter(
            PainDiary.user_id == current_user.id,
            PainDiary.recorded_at >= month_start,
        )
        .scalar()
    )

    return {
        "exercises_this_week": exercises_this_week,
        "exercises_this_month": exercises_this_month,
        "avg_pain_last_30_days": float(avg_pain_last_30_days)
        if avg_pain_last_30_days is not None
        else None,
    }


@router.post("/pain")
def log_pain(
    request: PainDiaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pain_entry = PainDiary(
        user_id=current_user.id,
        recorded_at=datetime.utcnow(),
        pain_score=request.pain_score,
        stiffness_score=request.stiffness_score if request.stiffness_score is not None else 0,
        location=request.location or current_user.oa_location or "both",
        notes=request.notes,
    )
    db.add(pain_entry)
    db.commit()

    return {"message": "Pain diary entry logged successfully"}


@router.get("/pain")
def get_pain_entries(
    days: int = Query(default=30, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start_date = datetime.utcnow() - timedelta(days=days)
    entries = (
        db.query(PainDiary)
        .filter(
            PainDiary.user_id == current_user.id,
            PainDiary.recorded_at >= start_date,
        )
        .order_by(PainDiary.recorded_at.desc())
        .all()
    )

    return [
        {
            "date": entry.recorded_at.date().isoformat(),
            "pain_score": entry.pain_score,
            "stiffness_score": entry.stiffness_score,
            "location": entry.location,
            "notes": entry.notes,
        }
        for entry in entries
    ]


@router.patch("/status")
def update_exercise_status(
    data: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.status not in ["started", "in_progress", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    status_entry = db.query(ExerciseStatus).filter(
        ExerciseStatus.user_id == current_user.id,
        ExerciseStatus.exercise_id == data.exercise_id
    ).first()

    now = datetime.utcnow()

    if not status_entry:
        status_entry = ExerciseStatus(
            user_id=current_user.id,
            exercise_id=data.exercise_id,
            status=data.status,
            notes=data.notes
        )
        if data.status == "started":
            status_entry.started_at = now
        elif data.status == "completed":
            status_entry.completed_at = now
        db.add(status_entry)
    else:
        if data.status == "started" and status_entry.started_at is None:
            status_entry.started_at = now
        if data.status == "completed":
            status_entry.completed_at = now
        
        status_entry.status = data.status
        if data.notes is not None:
            status_entry.notes = data.notes
        status_entry.updated_at = now
        
    db.commit()
    return {"message": "Status updated successfully", "status": data.status}


@router.get("/status")
def get_exercise_statuses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statuses = (
        db.query(ExerciseStatus, Exercise)
        .join(Exercise, ExerciseStatus.exercise_id == Exercise.id)
        .filter(ExerciseStatus.user_id == current_user.id)
        .all()
    )

    return [
        {
            "exercise_id": str(status.exercise_id),
            "exercise_name": exercise.name,
            "target_area": exercise.target_area,
            "status": status.status,
            "started_at": status.started_at.isoformat() if status.started_at else None,
            "completed_at": status.completed_at.isoformat() if status.completed_at else None,
            "updated_at": status.updated_at.isoformat() if status.updated_at else None,
        }
        for status, exercise in statuses
    ]
