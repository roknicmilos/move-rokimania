import secrets
from decouple import config
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2id via Pwdlib.

    Argon2 does not have the 72-byte limit that Bcrypt does,
    so no manual length check is required.
    """
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return password_hash.verify(plain_password, hashed_password)


def generate_token() -> str:
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)


def set_user_token_cookie(response, token: str):
    """Set the user_token cookie with appropriate security flags."""
    two_week_seconds = 14 * 24 * 60 * 60
    secure = config("COOKIE_SECURE", default=True, cast=bool)
    response.set_cookie(
        key="user_token",
        value=f"Bearer {token}",
        httponly=True,  # Prevents JS access (XSS protection)
        secure=secure,
        samesite="none" if secure else "lax",
        max_age=two_week_seconds,
    )


def unset_user_token_cookie(response):
    """Unset the user_token cookie."""
    response.delete_cookie(key="user_token")
