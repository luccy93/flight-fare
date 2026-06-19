from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from app.database import get_db
from app.api.deps import get_current_admin_user
from app.models.user import User
from app.models.prediction import Prediction

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(User).order_by(User.created_at.desc())
    rows = (await db.execute(q)).scalars().all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "is_active": u.is_active,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in rows
    ]


@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(User).where(User.id == user_id)
    u = (await db.execute(q)).scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "id": u.id,
        "email": u.email,
        "username": u.username,
        "full_name": u.full_name,
        "is_active": u.is_active,
        "is_admin": u.is_admin,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(User).where(User.id == user_id)
    u = (await db.execute(q)).scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await db.delete(u)
    await db.flush()
    return {"message": "User deleted successfully"}


@router.get("/predictions")
async def list_predictions(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(Prediction).order_by(Prediction.created_at.desc()).limit(200)
    rows = (await db.execute(q)).scalars().all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "airline": p.airline,
            "source": p.source,
            "destination": p.destination,
            "predicted_price": p.predicted_price,
            "price_category": p.price_category,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in rows
    ]


@router.get("/analytics/overview")
async def analytics_overview(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_predictions = (await db.execute(select(func.count(Prediction.id)))).scalar() or 0
    avg_price = (await db.execute(select(func.avg(Prediction.predicted_price)))).scalar() or 0
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "average_predicted_price": round(float(avg_price), 2),
    }


@router.get("/analytics/fare-trends")
async def fare_trends(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(Prediction.airline, func.avg(Prediction.predicted_price).label("avg_fare")).group_by(Prediction.airline)
    rows = (await db.execute(q)).all()
    return [{"airline": r.airline, "average_fare": round(float(r.avg_fare), 2)} for r in rows]


@router.get("/analytics/airline-comparison")
async def airline_comparison(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    q = select(
        Prediction.airline,
        func.count(Prediction.id).label("count"),
        func.avg(Prediction.predicted_price).label("avg_fare"),
        func.min(Prediction.predicted_price).label("min_fare"),
        func.max(Prediction.predicted_price).label("max_fare"),
    ).group_by(Prediction.airline)
    rows = (await db.execute(q)).all()
    return [
        {
            "airline": r.airline,
            "prediction_count": r.count,
            "average_fare": round(float(r.avg_fare), 2),
            "min_fare": round(float(r.min_fare), 2),
            "max_fare": round(float(r.max_fare), 2),
        }
        for r in rows
    ]


@router.get("/analytics/monthly-trends")
async def monthly_trends(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    import traceback
    try:
        raw = await db.execute(
            select(Prediction.created_at, Prediction.predicted_price)
            .order_by(Prediction.created_at)
        )
        rows = raw.all()
        monthly = {}
        for r in rows:
            if r.created_at:
                key = r.created_at.strftime("%Y-%m")
                if key not in monthly:
                    monthly[key] = {"count": 0, "total": 0.0}
                monthly[key]["count"] += 1
                monthly[key]["total"] += r.predicted_price
        result = []
        for k in sorted(monthly):
            result.append({
                "month": k,
                "average_fare": round(monthly[k]["total"] / monthly[k]["count"], 2),
                "prediction_count": monthly[k]["count"],
            })
        return result
    except Exception as e:
        return {"error": str(e)}


@router.get("/logs")
async def view_logs(
    admin: User = Depends(get_current_admin_user),
):
    import os
    log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "logs", "app.log")
    if not os.path.exists(log_path):
        return {"logs": []}
    with open(log_path, "r") as f:
        lines = f.readlines()[-100:]
    return {"logs": lines}
