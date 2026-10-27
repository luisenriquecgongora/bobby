# services/bobby-engine/src/config.py
"""
Configuration settings for the Bobby Computational Geometry Engine.
"""

import os
from typing import List


class EngineConfig:
    SERVICE_NAME: str = "bobby-engine"
    VERSION: str = "0.1.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")

    # Allowed CORS origins for local web studio and desktop Tauri dev
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:3301,http://localhost:5173,http://tauri.localhost,*"
        ).split(",")
        if origin.strip()
    ]

    DEFAULT_MIN_CLEARANCE_METERS: float = float(
        os.getenv("DEFAULT_MIN_CLEARANCE_METERS", "1.20")
    )


settings = EngineConfig()
