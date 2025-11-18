import enum

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)

from src.models import Base, BaseModel


class RepsEntryType(str, enum.Enum):
    PUSH_UPS = "PUSH_UPS"
    PULL_UPS = "PULL_UPS"
    CHIN_UPS = "CHIN_UPS"
    SQUATS = "SQUATS"
    ROMANIAN_DEADLIFTS = "ROMANIAN_DEADLIFTS"
    ROWS = "ROWS"
    TIBIALIS_RAISES = "TIBIALIS_RAISES"
    CALF_RAISES = "CALF_RAISES"
    NORDIC_CURLS = "NORDIC_CURLS"
    REVERSE_NORDIC_CURLS = "REVERSE_NORDIC_CURLS"
    ABS_ROLL_OUTS = "ABS_ROLL_OUTS"


class HoldEntryType(str, enum.Enum):
    PLANK = "PLANK"
    HANGING = "HANGING"
    SQUAT_HOLD = "SQUAT_HOLD"


class Entry(Base, BaseModel):
    """Model representing a fitness log entry."""

    __tablename__ = "entries"

    type = Column(String(50))
    load = Column(Integer, nullable=False, server_default="0")
    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )

    __mapper_args__ = {
        "polymorphic_identity": "entry",
        "polymorphic_on": type,
    }
    __table_args__ = (CheckConstraint("load >= 0", name="load_positive"),)


class RepsEntry(Entry):
    """Model representing a fitness log entry based on repetitions."""

    __tablename__ = "reps_entries"

    id = Column(Integer, ForeignKey("entries.id"), primary_key=True)
    reps = Column(Integer, nullable=False, server_default="0")
    exercise = Column(Enum(RepsEntryType), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "reps_entry",
    }
    __table_args__ = (CheckConstraint("reps >= 0", name="reps_positive"),)


class HoldEntry(Entry):
    """Model representing a fitness log entry based on hold duration."""

    __tablename__ = "hold_entries"

    id = Column(Integer, ForeignKey("entries.id"), primary_key=True)
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=False)
    exercise = Column(Enum(HoldEntryType), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "hold_entry",
    }
