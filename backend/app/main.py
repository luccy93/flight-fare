import time
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest, REGISTRY, CONTENT_TYPE_LATEST
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.auth import router as auth_router
from app.api.predictions import router as prediction_router
from app.api.routes import router as routes_router
from app.api.admin import router as admin_router
from app.api.user import router as user_router
from app.database import engine, Base
from app.services.cache_service import cache_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

REQUEST_COUNT = Counter("http_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
REQUEST_DURATION = Histogram("http_request_duration_seconds", "HTTP request duration", ["method", "endpoint"])


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start
        REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path, status=response.status_code).inc()
        REQUEST_DURATION.labels(method=request.method, endpoint=request.url.path).observe(duration)
        return response


class TrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if len(path) > 1 and path.endswith("/"):
            request.scope["path"] = path.rstrip("/")
            request.scope["root_path"] = request.scope.get("root_path", "").rstrip("/")
            request._url = None
        return await call_next(request)


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window_seconds]
        if len(self.requests[client_ip]) >= self.max_requests:
            return JSONResponse(status_code=429, content={"detail": "Too many requests"})
        self.requests[client_ip].append(now)
        return await call_next(request)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up - creating database tables")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Seeding default user")
    try:
        from app.database import async_session
        from app.models.user import User
        from app.core.security import get_password_hash
        from sqlalchemy import select
        async with async_session() as session:
            existing = await session.execute(select(User).where(User.email == "demo@flightfare.com"))
            if not existing.scalar_one_or_none():
                demo = User(
                    email="demo@flightfare.com",
                    username="demo",
                    password_hash=get_password_hash("demo12345"),
                    full_name="Demo User",
                    is_admin=True,
                )
                session.add(demo)
                await session.commit()
                logger.info("Default user created: demo@flightfare.com / demo12345")
            else:
                logger.info("Default user already exists")
    except Exception as e:
        logger.warning(f"Could not seed default user: {e}")
    logger.info("Initializing cache service")
    await cache_service.init()
    logger.info("Application startup complete")
    yield
    logger.info("Shutting down - closing connections")
    await cache_service.close()
    await engine.dispose()


app = FastAPI(
    title="Flight Fare Prediction API",
    description="Backend for Flight Fare Prediction application",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(TrailingSlashMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(MetricsMiddleware)
app.add_middleware(RateLimitMiddleware)

app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(routes_router)
app.include_router(admin_router)
app.include_router(user_router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "flight-fare-prediction-api", "version": "1.0.0"}


@app.get("/metrics")
async def metrics():
    return JSONResponse(content=generate_latest(REGISTRY).decode(), media_type=CONTENT_TYPE_LATEST)
