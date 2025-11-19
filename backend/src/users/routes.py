from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_async_db
from . import models, schemas
from .service import authenticate_user, register_user
from .exceptions import InvalidCredentialsError, UsernameAlreadyExistsError
from .dependencies import get_current_user
from ..exceptions import FieldValidationError

router = APIRouter(prefix="/users", tags=["users"])


@router.post(
    "/register",
    response_model=schemas.UserWithToken,
    status_code=status.HTTP_201_CREATED
)
async def register(
    user_data: schemas.UserRegister,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        user = await register_user(user_data, db)
    except UsernameAlreadyExistsError as exc:
        raise FieldValidationError(field="username", message=str(exc)) from exc

    return schemas.UserWithToken(
        id=user.id,
        username=user.username,
        created_at=user.created_at,
        updated_at=user.updated_at,
        token=user.token,
    )


@router.post("/login", response_model=schemas.UserWithToken)
async def login(
    credentials: schemas.UserLogin,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        user = await authenticate_user(credentials, db)
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    return schemas.UserWithToken(
        id=user.id,
        username=user.username,
        created_at=user.created_at,
        updated_at=user.updated_at,
        token=user.token,
    )


@router.get("/me", response_model=schemas.UserRead)
async def get_me(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user data."""
    return current_user
