from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    DB_HOST: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: int = 5432
    SQLALCHEMY_DATABASE_URL: str
    ASYNC_SQLALCHEMY_DATABASE_URL: str
    CORS_ALLOWED_ORIGINS: list[str] = []
    COOKIE_SECURE: str = False
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: str = "localhost"

    model_config = SettingsConfigDict(env_file=None)

    @model_validator(mode="after")
    def build_database_urls(self):
        self.SQLALCHEMY_DATABASE_URL = (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )
        self.ASYNC_SQLALCHEMY_DATABASE_URL = (
            f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )
        return self


@lru_cache
def get_settings():
    return Settings()
