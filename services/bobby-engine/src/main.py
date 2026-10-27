# services/bobby-engine/src/main.py
"""
Bobby Computational Geometry & Spatial Validation Engine
Standalone FastAPI microservice for authoritative 3D CAD calculations,
collision detection, and algorithmic wall extrusion.
"""

import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .api.routes import router as spatial_router

START_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle startup and shutdown hooks."""
    print(f"🚀 [bobby-engine] Starting {settings.SERVICE_NAME} v{settings.VERSION} on {settings.HOST}:{settings.PORT}")
    yield
    print(f"🛑 [bobby-engine] Shutting down {settings.SERVICE_NAME}")


app = FastAPI(
    title="Bobby 3D Computational Geometry Engine",
    description=(
        "Authoritative 3D spatial validation, collision detection, algorithmic wall extrusion, "
        "and egress clearance checker microservice for the Bobby Venue Builder CAD platform."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for Web studio PWA and Tauri desktop
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount spatial routes
app.include_router(spatial_router)


@app.get("/", summary="Root index")
async def root_index():
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "endpoints": [
            "GET /health",
            "POST /v1/spatial/validate",
            "POST /v1/spatial/extrude-walls",
            "POST /v1/spatial/diff",
        ]
    }


@app.get("/health", summary="Service health & uptime probe")
async def health_check():
    """Liveness probe reporting service status, uptime, and version."""
    uptime_seconds = time.time() - START_TIME
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "ok",
            "service": settings.SERVICE_NAME,
            "version": settings.VERSION,
            "uptime_seconds": round(uptime_seconds, 2),
            "timestamp": time.time(),
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
