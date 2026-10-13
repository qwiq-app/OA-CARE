import logging
from sqlalchemy.orm import Session
from app.config import settings
from app.database import Base, engine
from app.models.models import Exercise, User
from app.routers.exercises import HIP_EXERCISES, KNEE_EXERCISES
from app.utils.security import hash_password

# Configure logger
logger = logging.getLogger(__name__)

def create_tables() -> None:
    """
    Creates all database tables defined by Base models.
    """
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

def seed_exercises(db: Session) -> dict:
    """
    Seeds the knee and hip exercises if the exercise table is currently empty.
    Keeps operations idempotent and safe from duplication.
    """
    count = db.query(Exercise).count()
    logger.info(f"Exercise count: {count}")
    
    if count == 0:
        seed_data = KNEE_EXERCISES + HIP_EXERCISES
        exercises = [
            Exercise(sort_order=index + 1, **exercise_data)
            for index, exercise_data in enumerate(seed_data)
        ]
        db.add_all(exercises)
        db.commit()
        logger.info(f"Seeded {len(exercises)} exercises")
        return {"message": "Exercises seeded successfully", "inserted_count": len(exercises)}
    else:
        logger.info("Exercises already exist")
        return {"message": "Exercises already seeded", "inserted_count": 0}

def create_default_admin(db: Session) -> None:
    """
    Creates a default admin user if no administrator accounts exist.
    Will pull credential details from the application settings, hashing the password.
    """
    email = settings.DEFAULT_ADMIN_EMAIL
    password = settings.DEFAULT_ADMIN_PASSWORD
    name = settings.DEFAULT_ADMIN_NAME

    # Check if any admin user exists
    admin_exists = db.query(User).filter(User.role == "admin").first() is not None
    if admin_exists:
        logger.info("Default admin already exists")
        return

    # Check if default admin email is already taken
    email_exists = db.query(User).filter(User.email == email).first() is not None
    if email_exists:
        logger.warning(f"Email {email} is already registered under another role. Skipping default admin creation to prevent email collision.")
        return

    hashed_pw = hash_password(password)
    admin_user = User(
        full_name=name,
        email=email,
        password_hash=hashed_pw,
        role="admin",
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    logger.info("Created default administrator")
