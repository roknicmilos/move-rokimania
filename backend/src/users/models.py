from sqlalchemy import Column, String
from src.models import Base, BaseModel


class User(Base, BaseModel):

    __tablename__ = "users"

    token = Column(String(255), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, nullable=False, index=True)
