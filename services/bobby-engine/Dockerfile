# syntax=docker/dockerfile:1.4
# ==============================================================================
# Stage 1: Build & Dependencies
# ==============================================================================
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build tools for compiling scientific packages if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libgeos-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into a separate wheels directory or venv
RUN pip install --no-cache-dir --user -r requirements.txt

# ==============================================================================
# Stage 2: Final Minimal Production Image (<100MB RAM footprint)
# ==============================================================================
FROM python:3.12-slim AS runner

WORKDIR /app

# Install minimal runtime shared libraries (GEOS for Shapely)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgeos-c1v5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root unprivileged service user
RUN groupadd -r bobby && useradd -r -g bobby -d /app -s /sbin/nologin bobby

# Copy installed python site-packages from builder
COPY --from=builder /root/.local /home/bobby/.local

# Copy application source code
COPY src /app/src
COPY pyproject.toml /app/

# Set environment paths and permissions
ENV PATH=/home/bobby/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    HOST=0.0.0.0

RUN chown -R bobby:bobby /app

USER bobby

EXPOSE 8000

# Docker healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production server execution using uvicorn with single worker to fit <100MB RAM
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--access-log"]
