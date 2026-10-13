from typing import Literal, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Exercise
from app.utils.security import require_admin


router = APIRouter()


ExerciseCategory = Literal["strengthening", "stretching", "balance", "cardio", "calisthenics"]
ExerciseLevel = Literal["beginner", "intermediate", "advanced"]
TargetArea = Literal["hip", "knee", "both"]


KNEE_EXERCISES = [
    {
        "name": "Straight Leg Raise",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Beginner knee strengthening exercise for quadriceps control.",
        "instructions": [
            "Lie flat on back.",
            "Tighten quads.",
            "Lift one leg about 1 foot while keeping knee locked.",
            "Hold 3 seconds.",
            "Lower down.",
            "Perform both legs, 2 sets of 15 reps.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": 3,
        "precautions": "Keep lower back flat on floor.",
    },
    {
        "name": "Quad Set",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Gentle isometric quadriceps activation.",
        "instructions": [
            "Lie on back with one knee bent on a towel roll and the other leg straight.",
            "Squeeze thigh muscles while pushing knee into towel.",
            "Keep back flat.",
            "Perform both legs, 2 sets of 15 reps.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": None,
        "precautions": None,
    },
    {
        "name": "Lying Quad Stretch",
        "category": "stretching",
        "level": "beginner",
        "target_area": "knee",
        "description": "Gentle front-thigh stretch.",
        "instructions": [
            "Lie near edge of bed.",
            "Bend right leg with foot flat on bed.",
            "Hang left leg over edge with thigh resting on bed.",
            "Hold 10-15 seconds.",
            "Repeat opposite leg, 2-3 times each.",
        ],
        "sets": 3,
        "reps": None,
        "hold_seconds": 15,
        "precautions": None,
    },
    {
        "name": "Side-Lying Leg Raise",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Hip and thigh strengthening exercise that supports knee mechanics.",
        "instructions": [
            "Lie on side with hips, knees, and feet stacked.",
            "Place top arm in front for balance.",
            "Lift top leg to hip height.",
            "Hold 2-3 seconds.",
            "Lower slowly.",
            "Perform both legs, 2 sets of 15 reps.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": 3,
        "precautions": None,
    },
    {
        "name": "Bridging",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Glute and posterior chain strengthening.",
        "instructions": [
            "Lie on back.",
            "Tighten core and squeeze glutes.",
            "Raise butt off floor while keeping back straight.",
            "Hold 5 seconds.",
            "Perform 2 sets of 15 reps.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": 5,
        "precautions": "Do not overarch lower back.",
    },
    {
        "name": "Step-Ups",
        "category": "strengthening",
        "level": "intermediate",
        "target_area": "knee",
        "description": "Functional strengthening for stairs and daily activity.",
        "instructions": [
            "Stand at bottom of step and hold handrail.",
            "Lift one foot and step onto step.",
            "Bring other foot up.",
            "Step back down in reverse.",
            "Perform 1-2 sets of 10 reps.",
            "Can also do laterally.",
        ],
        "sets": 2,
        "reps": 10,
        "hold_seconds": None,
        "precautions": "Always hold handrail for safety.",
    },
    {
        "name": "Sit-to-Stand",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Functional lower-limb strengthening from a chair.",
        "instructions": [
            "Sit upright in chair with back straight.",
            "Cross arms on chest.",
            "Lean torso forward.",
            "Press into feet to stand.",
            "Slowly sit back.",
            "Distribute weight evenly.",
            "Perform 3 sets of 5 reps.",
        ],
        "sets": 3,
        "reps": 5,
        "hold_seconds": None,
        "precautions": "Hold another chair for support if needed.",
    },
    {
        "name": "Mini Squats at Countertop",
        "category": "strengthening",
        "level": "beginner",
        "target_area": "knee",
        "description": "Supported mini squat for lower-limb strength.",
        "instructions": [
            "Stand feet shoulder-width apart with hands on countertop.",
            "Slowly bend knees into mini squat.",
            "Hold a couple seconds.",
            "Return to standing.",
            "Keep heels on ground and knees not past toes.",
            "Perform 3 sets of 5 reps.",
        ],
        "sets": 3,
        "reps": 5,
        "hold_seconds": 2,
        "precautions": None,
    },
    {
        "name": "Tandem Balance",
        "category": "balance",
        "level": "intermediate",
        "target_area": "knee",
        "description": "Heel-to-toe balance drill.",
        "instructions": [
            "Stand upright with arms at sides.",
            "Place one foot directly in front heel-to-toe.",
            "Maintain balance with back straight and arms at sides.",
            "Work toward 30-second holds.",
            "Alternate feet.",
        ],
        "sets": 3,
        "reps": 3,
        "hold_seconds": 30,
        "precautions": None,
    },
    {
        "name": "Single-Leg Balance",
        "category": "balance",
        "level": "intermediate",
        "target_area": "knee",
        "description": "Single-leg stance balance training.",
        "instructions": [
            "Stand feet together.",
            "Lift one foot and balance on other leg.",
            "Do not shift weight side to side.",
            "Extend arms or hold rail if needed.",
            "Work toward 15-second holds each foot.",
        ],
        "sets": 3,
        "reps": 3,
        "hold_seconds": 15,
        "precautions": "Stand near wall or chair for safety.",
    },
    {
        "name": "Calf Stretch with Towel",
        "category": "stretching",
        "level": "beginner",
        "target_area": "knee",
        "description": "Seated calf stretch using a towel.",
        "instructions": [
            "Sit on floor with one leg stretched out.",
            "Secure towel around foot.",
            "Pull foot toward you until calf stretch is felt.",
            "Keep knee straight.",
            "Hold 10-15 seconds.",
            "Alternate legs.",
        ],
        "sets": 5,
        "reps": 5,
        "hold_seconds": 15,
        "precautions": None,
    },
    {
        "name": "Seated Hamstring Stretch",
        "category": "stretching",
        "level": "beginner",
        "target_area": "knee",
        "description": "Seated hamstring stretch for posterior thigh flexibility.",
        "instructions": [
            "Sit upright on edge of bench.",
            "Place one leg straight on surface and other foot flat on floor.",
            "Lean forward hinging at hips until stretch is felt behind leg.",
            "Keep knees straight, toes up, and back straight.",
            "Hold 10-15 seconds.",
            "Alternate legs.",
        ],
        "sets": 5,
        "reps": 5,
        "hold_seconds": 15,
        "precautions": None,
    },
]


HIP_EXERCISES = [
    {
        "name": "Plank",
        "category": "strengthening",
        "level": "intermediate",
        "target_area": "hip",
        "description": "Core strengthening exercise supporting hip control.",
        "instructions": [
            "Lie on stomach with elbows under shoulders and palms down.",
            "Push up keeping elbows and forearms on floor.",
            "Keep legs and torso straight with back flat.",
            "Hold 30 seconds to 1 minute.",
            "Easier option: keep knees on floor.",
        ],
        "sets": None,
        "reps": None,
        "hold_seconds": 60,
        "precautions": "Keep hips level, do not let back sag.",
    },
    {
        "name": "Lunges",
        "category": "strengthening",
        "level": "intermediate",
        "target_area": "hip",
        "description": "Lower-limb strengthening exercise for hip and knee control.",
        "instructions": [
            "Stand feet hip-width apart with hands on hips.",
            "Keep back straight and step forward with right leg.",
            "Bend both knees with left knee pointing down and right knee above right foot.",
            "Push back to standing.",
            "Alternate legs.",
            "Easier option: reverse lunges stepping backward.",
        ],
        "sets": 2,
        "reps": 10,
        "hold_seconds": None,
        "precautions": "Do not let front knee go past toes.",
    },
    {
        "name": "Squats",
        "category": "strengthening",
        "level": "intermediate",
        "target_area": "hip",
        "description": "Compound lower-limb strengthening exercise.",
        "instructions": [
            "Stand feet slightly wider than hip-width with toes slightly outward.",
            "Shift weight to heels and brace core with chest out and back straight.",
            "Lower hips until thighs are parallel.",
            "Keep head forward and heels flat.",
            "Push through feet to stand.",
            "Support option: hold chair or countertop.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": None,
        "precautions": "Keep knees aligned over second toes, do not cave inward.",
    },
    {
        "name": "Push-Ups",
        "category": "strengthening",
        "level": "intermediate",
        "target_area": "hip",
        "description": "Upper-body and core strengthening option for whole-body conditioning.",
        "instructions": [
            "Kneel on all fours with palms flat, fingers forward, and hands shoulder-width apart.",
            "Easier option: keep knees on floor.",
            "Harder option: straighten legs.",
            "Bend elbows and lower until chest nearly touches floor.",
            "Keep elbows close to sides.",
            "Press up.",
            "Wall push-ups are an easier option.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": None,
        "precautions": "Do not let hips sag or back arch.",
    },
    {
        "name": "Burpees",
        "category": "cardio",
        "level": "advanced",
        "target_area": "hip",
        "description": "Advanced cardio and conditioning exercise.",
        "instructions": [
            "Stand hip-width.",
            "Drop into squat and place hands in front of feet.",
            "Kick legs back to plank.",
            "Do a push-up.",
            "Return to plank.",
            "Jump feet forward to hands.",
            "Jump up with arms toward ceiling.",
            "Beginner option: skip push-up and use chair for plank.",
        ],
        "sets": 2,
        "reps": 10,
        "hold_seconds": None,
        "precautions": "Not recommended during active joint flare-up.",
    },
    {
        "name": "Suspension Plank",
        "category": "strengthening",
        "level": "advanced",
        "target_area": "hip",
        "description": "Advanced plank variation using suspension straps.",
        "instructions": [
            "Get into plank position with tops of feet in suspension straps.",
            "Hold for as long as comfortable.",
            "Keep body in a straight line.",
        ],
        "sets": None,
        "reps": None,
        "hold_seconds": 30,
        "precautions": "Only use with proper suspension equipment.",
    },
    {
        "name": "Suspension Side Plank",
        "category": "strengthening",
        "level": "advanced",
        "target_area": "hip",
        "description": "Advanced side plank variation using suspension straps.",
        "instructions": [
            "Get into side plank.",
            "Stack feet on top of each other with insides touching.",
            "Put both feet in strap and cradle outside of bottom foot in strap.",
            "Hold as long as comfortable.",
            "Repeat other side.",
        ],
        "sets": None,
        "reps": None,
        "hold_seconds": 30,
        "precautions": None,
    },
    {
        "name": "Mountain Climber (Suspension)",
        "category": "cardio",
        "level": "advanced",
        "target_area": "hip",
        "description": "Advanced suspension cardio and core exercise.",
        "instructions": [
            "Get into plank with feet in suspension straps.",
            "Keep back straight and engage core.",
            "Pull knees toward chest keeping shoulders over hands.",
            "Return to start and repeat.",
        ],
        "sets": 2,
        "reps": 15,
        "hold_seconds": None,
        "precautions": None,
    },
]


class ExerciseBase(BaseModel):
    name: str
    category: ExerciseCategory
    level: ExerciseLevel
    target_area: TargetArea
    description: Optional[str] = None
    instructions: list[str] = Field(default_factory=list)
    sets: Optional[int] = None
    reps: Optional[int] = None
    hold_seconds: Optional[int] = None
    precautions: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[ExerciseCategory] = None
    level: Optional[ExerciseLevel] = None
    target_area: Optional[TargetArea] = None
    description: Optional[str] = None
    instructions: Optional[list[str]] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    hold_seconds: Optional[int] = None
    precautions: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ExerciseOut(BaseModel):
    id: str
    name: str
    category: str
    level: str
    target_area: str
    description: Optional[str] = None
    instructions: list[str] = Field(default_factory=list)
    sets: Optional[int] = None
    reps: Optional[int] = None
    hold_seconds: Optional[int] = None
    precautions: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_active: bool
    sort_order: int

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", mode="before")
    @classmethod
    def serialize_id(cls, value):
        return str(value)

    @field_validator("instructions", mode="before")
    @classmethod
    def default_instructions(cls, value):
        return value or []


def get_exercise_or_404(exercise_id: UUID, db: Session) -> Exercise:
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if exercise is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )
    return exercise


@router.get("/", response_model=list[ExerciseOut])
@router.get("", response_model=list[ExerciseOut], include_in_schema=False)
def list_exercises(
    target_area: Optional[TargetArea] = Query(default=None),
    level: Optional[ExerciseLevel] = Query(default=None),
    category: Optional[ExerciseCategory] = Query(default=None),
    limit: Optional[int] = Query(default=None, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Exercise).filter(Exercise.is_active.is_(True))

    if target_area:
        if target_area == "both":
            query = query.filter(Exercise.target_area == "both")
        else:
            query = query.filter(Exercise.target_area.in_([target_area, "both"]))

    if level:
        query = query.filter(Exercise.level == level)

    if category:
        query = query.filter(Exercise.category == category)

    query = query.order_by(Exercise.sort_order, Exercise.name)

    if limit is not None:
        query = query.limit(limit)

    return query.all()


@router.get("/{exercise_id}", response_model=ExerciseOut)
def get_exercise(exercise_id: UUID, db: Session = Depends(get_db)):
    return get_exercise_or_404(exercise_id, db)


@router.post("/", response_model=ExerciseOut, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=ExerciseOut, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_exercise(
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    exercise = Exercise(**exercise_data.model_dump())
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.put("/{exercise_id}", response_model=ExerciseOut)
def update_exercise(
    exercise_id: UUID,
    exercise_data: ExerciseUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    exercise = get_exercise_or_404(exercise_id, db)

    for field, value in exercise_data.model_dump(exclude_unset=True).items():
        setattr(exercise, field, value)

    db.commit()
    db.refresh(exercise)
    return exercise


@router.delete("/{exercise_id}")
def delete_exercise(
    exercise_id: UUID,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    exercise = get_exercise_or_404(exercise_id, db)
    exercise.is_active = False
    db.commit()

    return {"message": "Exercise deleted successfully"}
