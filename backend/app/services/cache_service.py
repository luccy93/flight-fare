import json
import logging
from typing import Any
from app.core.config import settings

logger = logging.getLogger(__name__)

try:
    import redis.asyncio as redis
    HAS_REDIS = True
except ImportError:
    HAS_REDIS = False
    logger.info("Redis not installed — using no-op cache")


class CacheService:
    def __init__(self):
        self.client = None
        self._enabled = HAS_REDIS and bool(settings.REDIS_URL)

    async def init(self):
        if not self._enabled:
            return
        try:
            self.client = await redis.from_url(settings.REDIS_URL, decode_responses=True)
            await self.client.ping()
            logger.info("Connected to Redis")
        except Exception as e:
            logger.warning(f"Redis unavailable ({e}), caching disabled")
            self._enabled = False

    async def get(self, key: str) -> Any:
        if not self._enabled or self.client is None:
            return None
        try:
            val = await self.client.get(key)
            if val:
                return json.loads(val)
        except Exception:
            pass
        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        if not self._enabled or self.client is None:
            return
        try:
            await self.client.set(key, json.dumps(value), ex=ttl)
        except Exception:
            pass

    async def delete(self, key: str) -> None:
        if not self._enabled or self.client is None:
            return
        try:
            await self.client.delete(key)
        except Exception:
            pass

    async def exists(self, key: str) -> bool:
        if not self._enabled or self.client is None:
            return False
        try:
            return await self.client.exists(key) > 0
        except Exception:
            return False

    async def close(self):
        if self.client:
            try:
                await self.client.close()
            except Exception:
                pass


cache_service = CacheService()
