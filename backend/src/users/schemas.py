from datetime import datetime

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)


class UserRegister(UserBase):
    password: str = Field(..., min_length=8, max_length=72)


class UserLogin(BaseModel):
    username: str
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
