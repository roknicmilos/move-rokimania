from datetime import datetime
from typing import Union

from pydantic import BaseModel, Field

from .models import HoldEntryType, RepsEntryType


class EntryBase(BaseModel):
    load: int = Field(0, ge=0)


class RepsEntryBase(EntryBase):
    reps: int = Field(..., ge=0)
    exercise: RepsEntryType


class HoldEntryBase(EntryBase):
    started_at: datetime
    ended_at: datetime
    exercise: HoldEntryType


class RepsEntryCreate(RepsEntryBase):
    pass


class HoldEntryCreate(HoldEntryBase):
    pass


class EntryRead(EntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True


class RepsEntryRead(RepsEntryBase, EntryRead):
    pass


class HoldEntryRead(HoldEntryBase, EntryRead):
    pass


AnyEntry = Union[RepsEntryRead, HoldEntryRead]
