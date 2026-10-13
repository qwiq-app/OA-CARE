from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Exercise, ExerciseLog, PainDiary, User, ExerciseStatus
from app.utils.security import require_admin
from app.utils.seed import seed_exercises as seed_exercises_db


router = APIRouter(dependencies=[Depends(require_admin)])


def serialize_user(user: User) -> dict:
    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "age": user.age,
        "gender": user.gender,
        "weight_kg": user.weight_kg,
        "height_cm": user.height_cm,
        "oa_location": user.oa_location,
        "oa_grade": user.oa_grade,
        "comorbidities": user.comorbidities,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "last_login": user.last_login,
    }


def serialize_exercise(exercise: Exercise) -> dict:
    return {
        "id": str(exercise.id),
        "name": exercise.name,
        "category": exercise.category,
        "level": exercise.level,
        "target_area": exercise.target_area,
        "description": exercise.description,
        "instructions": exercise.instructions or [],
        "sets": exercise.sets,
        "reps": exercise.reps,
        "hold_seconds": exercise.hold_seconds,
        "precautions": exercise.precautions,
        "video_url": exercise.video_url,
        "thumbnail_url": exercise.thumbnail_url,
        "is_active": exercise.is_active,
        "sort_order": exercise.sort_order,
    }


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)

    total_users = db.query(User).filter(User.role == "patient").count()
    active_today = (
        db.query(User)
        .filter(User.role == "patient", User.last_login >= today_start)
        .count()
    )
    new_this_week = (
        db.query(User)
        .filter(User.role == "patient", User.created_at >= week_start)
        .count()
    )
    exercises_this_week = (
        db.query(ExerciseLog)
        .filter(ExerciseLog.completed_at >= week_start)
        .count()
    )
    avg_pain_last_30_days = (
        db.query(func.avg(PainDiary.pain_score))
        .filter(PainDiary.recorded_at >= month_start)
        .scalar()
    )

    oa_distribution = {"hip": 0, "knee": 0, "both": 0}
    oa_rows = (
        db.query(User.oa_location, func.count(User.id))
        .filter(User.role == "patient", User.oa_location.isnot(None))
        .group_by(User.oa_location)
        .all()
    )
    for oa_location, count in oa_rows:
        if oa_location in oa_distribution:
            oa_distribution[oa_location] = count

    grade_distribution = {f"Grade {grade}": 0 for grade in range(1, 5)}
    grade_rows = (
        db.query(User.oa_grade, func.count(User.id))
        .filter(User.role == "patient", User.oa_grade.isnot(None))
        .group_by(User.oa_grade)
        .all()
    )
    for grade, count in grade_rows:
        key = f"Grade {grade}"
        if key in grade_distribution:
            grade_distribution[key] = count

    top_exercise_rows = (
        db.query(
            Exercise.name,
            Exercise.target_area,
            func.count(ExerciseLog.id).label("count"),
        )
        .join(ExerciseLog, ExerciseLog.exercise_id == Exercise.id)
        .filter(ExerciseLog.completed_at >= month_start)
        .group_by(Exercise.id, Exercise.name, Exercise.target_area)
        .order_by(func.count(ExerciseLog.id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_users": total_users,
        "active_today": active_today,
        "new_this_week": new_this_week,
        "exercises_this_week": exercises_this_week,
        "avg_pain_last_30_days": float(avg_pain_last_30_days)
        if avg_pain_last_30_days is not None
        else None,
        "oa_distribution": oa_distribution,
        "grade_distribution": grade_distribution,
        "top_exercises": [
            {"name": name, "target_area": target_area, "count": count}
            for name, target_area, count in top_exercise_rows
        ],
    }


@router.get("/exercises")
def list_admin_exercises(
    target_area: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Exercise)

    if target_area:
        query = query.filter(Exercise.target_area == target_area)

    if level:
        query = query.filter(Exercise.level == level)

    exercises = query.order_by(Exercise.sort_order, Exercise.name).all()
    return [serialize_exercise(exercise) for exercise in exercises]


@router.get("/users")
def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1),
    search: Optional[str] = None,
    oa_location: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role == "patient")

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(User.full_name.ilike(search_pattern), User.email.ilike(search_pattern))
        )

    if oa_location:
        query = query.filter(User.oa_location == oa_location)

    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return [serialize_user(user) for user in users]


@router.get("/users/{user_id}/activity")
def get_user_activity(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.role == "patient").first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    start_date = datetime.utcnow() - timedelta(days=30)
    exercise_logs = (
        db.query(ExerciseLog)
        .join(Exercise)
        .filter(
            ExerciseLog.user_id == user.id,
            ExerciseLog.completed_at >= start_date,
        )
        .order_by(ExerciseLog.completed_at.desc())
        .all()
    )
    pain_diary = (
        db.query(PainDiary)
        .filter(
            PainDiary.user_id == user.id,
            PainDiary.recorded_at >= start_date,
        )
        .order_by(PainDiary.recorded_at.desc())
        .all()
    )

    exercise_statuses = (
        db.query(ExerciseStatus, Exercise)
        .join(Exercise, ExerciseStatus.exercise_id == Exercise.id)
        .filter(ExerciseStatus.user_id == user.id)
        .order_by(ExerciseStatus.updated_at.desc())
        .all()
    )

    return {
        "user": serialize_user(user),
        "exercise_logs": [
            {
                "id": str(log.id),
                "exercise_name": log.exercise.name,
                "target_area": log.exercise.target_area,
                "completed_at": log.completed_at,
                "sets_done": log.sets_done,
                "reps_done": log.reps_done,
                "pain_before": log.pain_before,
                "pain_after": log.pain_after,
                "notes": log.notes,
            }
            for log in exercise_logs
        ],
        "pain_diary": [
            {
                "id": str(entry.id),
                "date": entry.recorded_at.date().isoformat(),
                "recorded_at": entry.recorded_at,
                "pain_score": entry.pain_score,
                "stiffness_score": entry.stiffness_score,
                "location": entry.location,
                "notes": entry.notes,
            }
            for entry in pain_diary
        ],
        "exercise_statuses": [
            {
                "exercise_id": str(status.exercise_id),
                "exercise_name": exercise.name,
                "target_area": exercise.target_area,
                "category": exercise.category,
                "level": exercise.level,
                "status": status.status,
                "started_at": status.started_at.isoformat() if status.started_at else None,
                "completed_at": status.completed_at.isoformat() if status.completed_at else None,
                "updated_at": status.updated_at.isoformat() if status.updated_at else None,
            }
            for status, exercise in exercise_statuses
        ],
    }


@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.role == "patient").first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    return {"user_id": str(user.id), "is_active": user.is_active}


@router.post("/seed-exercises")
def seed_exercises(db: Session = Depends(get_db)):
    return seed_exercises_db(db)


@router.get("/exercise-status-overview")
def exercise_status_overview(
    db: Session = Depends(get_db)
):
    # Count by status
    total_started = db.query(ExerciseStatus).filter(
        ExerciseStatus.status == "started"
    ).count()
    
    total_in_progress = db.query(ExerciseStatus).filter(
        ExerciseStatus.status == "in_progress"
    ).count()
    
    total_completed = db.query(ExerciseStatus).filter(
        ExerciseStatus.status == "completed"
    ).count()
    
    # Recent completions (last 10)
    recent = (
        db.query(ExerciseStatus, User, Exercise)
        .join(User, User.id == ExerciseStatus.user_id)
        .join(Exercise, Exercise.id == ExerciseStatus.exercise_id)
        .filter(ExerciseStatus.status == "completed")
        .order_by(ExerciseStatus.completed_at.desc())
        .limit(10)
        .all()
    )
    
    recent_completions = [
        {
            "user_name": user.full_name,
            "user_id": str(user.id),
            "exercise_name": exercise.name,
            "target_area": exercise.target_area,
            "completed_at": status.completed_at.isoformat() 
                if status.completed_at else None,
        }
        for status, user, exercise in recent
    ]
    
    # Completion by exercise
    exercises = db.query(Exercise).filter(
        Exercise.is_active == True
    ).all()
    
    completion_by_exercise = []
    for ex in exercises:
        started = db.query(ExerciseStatus).filter(
            ExerciseStatus.exercise_id == ex.id,
            ExerciseStatus.status == "started"
        ).count()
        in_prog = db.query(ExerciseStatus).filter(
            ExerciseStatus.exercise_id == ex.id,
            ExerciseStatus.status == "in_progress"
        ).count()
        completed = db.query(ExerciseStatus).filter(
            ExerciseStatus.exercise_id == ex.id,
            ExerciseStatus.status == "completed"
        ).count()
        
        if started + in_prog + completed > 0:
            completion_by_exercise.append({
                "exercise_name": ex.name,
                "target_area": ex.target_area,
                "level": ex.level,
                "started": started,
                "in_progress": in_prog,
                "completed": completed,
            })
    
    return {
        "total_started": total_started,
        "total_in_progress": total_in_progress,
        "total_completed": total_completed,
        "recent_completions": recent_completions,
        "completion_by_exercise": completion_by_exercise,
    }


@router.get("/users/{user_id}/exercise-status")
def get_user_exercise_status(user_id: UUID, db: Session = Depends(get_db)):
    statuses = (
        db.query(ExerciseStatus, Exercise)
        .join(Exercise, ExerciseStatus.exercise_id == Exercise.id)
        .filter(ExerciseStatus.user_id == user_id)
        .order_by(ExerciseStatus.updated_at.desc())
        .all()
    )
    
    return [
        {
            "exercise_id": str(status.exercise_id),
            "exercise_name": exercise.name,
            "target_area": exercise.target_area,
            "category": exercise.category,
            "level": exercise.level,
            "status": status.status,
            "started_at": status.started_at.isoformat() if status.started_at else None,
            "completed_at": status.completed_at.isoformat() if status.completed_at else None,
            "updated_at": status.updated_at.isoformat() if status.updated_at else None,
        }
        for status, exercise in statuses
    ]
