from typing import Literal, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.utils.security import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    oa_location: Optional[Literal["hip", "knee", "both"]] = None
    oa_grade: Optional[int] = Field(default=None, ge=1, le=4)
    comorbidities: Optional[list[str]] = None


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
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/me")
def update_me(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in profile.dict(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return serialize_user(current_user)
