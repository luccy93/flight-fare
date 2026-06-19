import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./flight_fare.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ML_MODEL_PATH: str = os.getenv("ML_MODEL_PATH", "ml/models/best_model.joblib")
    PREPROCESSOR_PATH: str = os.getenv("PREPROCESSOR_PATH", "ml/models/preprocessor.joblib")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


settings = Settings()
