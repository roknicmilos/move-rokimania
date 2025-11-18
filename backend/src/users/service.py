from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from . import models, schemas
from .auth import generate_token, hash_password, verify_password
from .exceptions import InvalidCredentialsError, UsernameAlreadyExistsError


async def register_user(
    user_data: schemas.UserRegister, db: AsyncSession
) -> models.User:
    """Create a user with hashed password and auth token."""
    result = await db.execute(
        select(models.User).where(models.User.username == user_data.username)
    )
    if result.scalar_one_or_none():
        raise UsernameAlreadyExistsError()

    hashed_password = hash_password(user_data.password)
    token = generate_token()

    db_user = models.User(
        username=user_data.username,
        hashed_password=hashed_password,
        token=token,
    )

    try:
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
    except IntegrityError as exc:
        await db.rollback()
        raise UsernameAlreadyExistsError() from exc

    return db_user


async def authenticate_user(
    credentials: schemas.UserLogin, db: AsyncSession
) -> models.User:
    """Validate credentials and rotate the user's auth token."""
    result = await db.execute(
        select(models.User).where(models.User.username == credentials.username)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(
        credentials.password, user.hashed_password
    ):
        raise InvalidCredentialsError()

    user.token = generate_token()
    await db.commit()
    await db.refresh(user)

    return user
