from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from sqlalchemy.orm import with_polymorphic

from src.database import get_async_db
from . import models, schemas

router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("/reps", response_model=schemas.RepsEntryRead)
async def create_reps_entry(
    entry: schemas.RepsEntryCreate, db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new repetition-based exercise entry.
    """
    db_entry = models.RepsEntry(**entry.model_dump())
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


@router.post("/hold", response_model=schemas.HoldEntryRead)
async def create_hold_entry(
    entry: schemas.HoldEntryCreate, db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new hold-based exercise entry.
    """
    db_entry = models.HoldEntry(**entry.model_dump())
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


@router.get("/", response_model=list[schemas.AnyEntry])
async def list_entries(db: AsyncSession = Depends(get_async_db)):
    """
    List all fitness log entries.
    """
    all_entries = with_polymorphic(models.Entry, "*")
    result = await db.execute(
        select(all_entries).order_by(all_entries.created_at.desc())
    )
    return result.scalars().all()
