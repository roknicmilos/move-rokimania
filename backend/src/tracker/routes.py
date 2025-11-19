from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from sqlalchemy.orm import with_polymorphic

from src.database import get_async_db
from src.users.dependencies import get_user_from_token
from src.users.models import User
from . import models, schemas

router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("/reps", response_model=schemas.RepsEntryRead)
async def create_reps_entry(
    entry: schemas.RepsEntryCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_user_from_token)
):
    db_entry = models.RepsEntry(**entry.model_dump(), user_id=current_user.id)
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


@router.post("/hold", response_model=schemas.HoldEntryRead)
async def create_hold_entry(
    entry: schemas.HoldEntryCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_user_from_token)
):
    db_entry = models.HoldEntry(**entry.model_dump(), user_id=current_user.id)
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


@router.get("/", response_model=list[schemas.AnyEntry])
async def list_entries(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_user_from_token)
):
    all_entries = with_polymorphic(models.Entry, "*")
    result = await db.execute(
        select(all_entries)
        .where(all_entries.user_id == current_user.id)
        .order_by(all_entries.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/reps/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reps_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_user_from_token)
):
    result = await db.execute(
        select(models.RepsEntry).where(
            models.RepsEntry.id == entry_id,
            models.RepsEntry.user_id == current_user.id
        )
    )
    entry = result.scalar_one_or_none()
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reps entry not found"
        )

    await db.delete(entry)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/hold/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hold_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_user_from_token)
):
    result = await db.execute(
        select(models.HoldEntry).where(
            models.HoldEntry.id == entry_id,
            models.HoldEntry.user_id == current_user.id
        )
    )
    entry = result.scalar_one_or_none()
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hold entry not found"
        )

    await db.delete(entry)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
