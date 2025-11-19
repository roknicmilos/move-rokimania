from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.database import get_async_db
from .models import User


async def get_user_from_token(
    cookie_token: str | None = Cookie(default=None, alias="user_token"),
    db: AsyncSession = Depends(get_async_db)
) -> User:
    """
    Dependency to get the current authenticated user
    from a token stored in a cookie.
    Expects token format: Bearer <token>
    """
    if not cookie_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Extract token from "Bearer <token>" format
    parts = cookie_token.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    token = parts[1]

    result = await db.execute(select(User).where(User.token == token))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    return user
