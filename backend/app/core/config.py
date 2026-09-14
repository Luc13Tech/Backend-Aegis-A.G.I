from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Aegis A.G.I."
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "default_secret_key_change_in_production"
    ANTHROPIC_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./aegis.db"  # Utilise SQLite par défaut pour le dev/test rapide

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
