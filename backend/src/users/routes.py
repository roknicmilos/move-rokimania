from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from src.database import get_async_db
from src.schemas import MessageResponse
from . import models, schemas
from .auth import set_user_token_cookie
from .service import authenticate_user, register_user
from .exceptions import InvalidCredentialsError, UsernameAlreadyExistsError
from .dependencies import get_user_from_token
from ..exceptions import FieldValidationError

router = APIRouter(prefix="/users", tags=["users"])


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(
    response: Response,
    user_data: schemas.UserRegister,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        user = await register_user(user_data, db)
    except UsernameAlreadyExistsError as exc:
        raise FieldValidationError(field="username", message=str(exc)) from exc

    set_user_token_cookie(response, user.token)

    return {"message": "User registered successfully."}


@router.post("/login", response_model=MessageResponse)
async def login(
    response: Response,
    credentials: schemas.UserLogin,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        user = await authenticate_user(credentials, db)
    except InvalidCredentialsError as exc:
        raise FieldValidationError(field="__all__", message=str(exc)) from exc

    set_user_token_cookie(response, user.token)

    return {"message": "User logged in successfully."}


@router.get("/me", response_model=schemas.UserRead)
async def get_me(
    current_user: models.User = Depends(get_user_from_token)
):
    """Get current authenticated user data."""
    return current_user
