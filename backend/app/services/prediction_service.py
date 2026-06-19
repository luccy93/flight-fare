import hashlib
import json
from datetime import datetime
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.ml.model_loader import predict as ml_predict
from app.services.cache_service import cache_service
from app.models.prediction import Prediction


CACHE_TTL = 600


def _build_cache_key(features: dict) -> str:
    raw = json.dumps(features, sort_keys=True)
    return f"prediction:{hashlib.md5(raw.encode()).hexdigest()}"


async def make_prediction(features: dict, user_id: str | None, session: AsyncSession) -> dict:
    cache_key = _build_cache_key(features)
    cached = await cache_service.get(cache_key)
    if cached:
        result = cached
    else:
        result = await ml_predict(features)
        await cache_service.set(cache_key, result, ttl=CACHE_TTL)

    pred = Prediction(
        user_id=user_id,
        airline=features.get("Airline", ""),
        source=features.get("Source", ""),
        destination=features.get("Destination", ""),
        departure_date=features.get("Date_of_Journey", ""),
        departure_time=features.get("Dep_Time", ""),
        arrival_time=features.get("Arrival_Time", ""),
        total_stops=features.get("Total_Stops", ""),
        cabin_class=features.get("Cabin_Class", ""),
        predicted_price=result["predicted_price"],
        confidence_score=result["confidence_score"],
        price_category=result["price_category"],
        recommendation=result["recommendation"],
    )
    session.add(pred)
    await session.flush()

    return {
        "predicted_price": result["predicted_price"],
        "confidence_score": result["confidence_score"],
        "price_category": result["price_category"],
        "recommendation": result["recommendation"],
        "cheapest_booking_window": result.get("cheapest_booking_window", "3-4 weeks before departure"),
        "prediction_id": pred.id,
    }


async def get_prediction_history(
    user_id: str, session: AsyncSession, page: int = 1, page_size: int = 20
) -> dict:
    offset = (page - 1) * page_size
    count_q = select(func.count(Prediction.id)).where(Prediction.user_id == user_id)
    total = (await session.execute(count_q)).scalar() or 0

    q = (
        select(Prediction)
        .where(Prediction.user_id == user_id)
        .order_by(desc(Prediction.created_at))
        .offset(offset)
        .limit(page_size)
    )
    rows = (await session.execute(q)).scalars().all()

    items = []
    for p in rows:
        items.append({
            "id": p.id,
            "airline": p.airline,
            "source": p.source,
            "destination": p.destination,
            "departure_date": p.departure_date,
            "predicted_price": p.predicted_price,
            "confidence_score": p.confidence_score,
            "price_category": p.price_category,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })

    return {"predictions": items, "total": total, "page": page, "page_size": page_size}


async def get_prediction_by_id(prediction_id: str, user_id: str, session: AsyncSession) -> dict | None:
    q = select(Prediction).where(
        Prediction.id == prediction_id, Prediction.user_id == user_id
    )
    p = (await session.execute(q)).scalar_one_or_none()
    if p is None:
        return None
    return {
        "id": p.id,
        "airline": p.airline,
        "source": p.source,
        "destination": p.destination,
        "departure_date": p.departure_date,
        "departure_time": p.departure_time,
        "arrival_time": p.arrival_time,
        "total_stops": p.total_stops,
        "cabin_class": p.cabin_class,
        "predicted_price": p.predicted_price,
        "confidence_score": p.confidence_score,
        "price_category": p.price_category,
        "recommendation": p.recommendation,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }
