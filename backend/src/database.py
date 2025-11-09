import os
from collections.abc import AsyncGenerator, Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker

from decouple import config

SQLALCHEMY_DATABASE_URL = config(
    "SQLALCHEMY_DATABASE_URL",
    default=None
)
ASYNC_SQLALCHEMY_DATABASE_URL = config(
    "ASYNC_SQLALCHEMY_DATABASE_URL",
    default=None
)

# Sync engine (for existing code and migrations)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Async engine
async_engine = create_async_engine(ASYNC_SQLALCHEMY_DATABASE_URL)
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)

# Import Base from the shared base model (contains id and created_at)
from src.models import Base  # noqa: E402

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


# Dependency for getting DB session (sync)
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Dependency for getting async DB session
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
