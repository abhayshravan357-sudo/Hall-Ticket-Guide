from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_env: str = "development"
    ai_provider: str = "mock"
    ai_api_key: str = ""
    ai_model: str = ""
    allowed_origins: List[str] = ["http://localhost:5173"]
    max_message_length: int = 2000
    rate_limit_per_minute: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()