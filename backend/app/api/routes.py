from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.saved_route import SavedRoute
from pydantic import BaseModel

router = APIRouter(prefix="/api/routes", tags=["routes"])


class SaveRouteRequest(BaseModel):
    route_name: str
    source: str
    destination: str


class RouteResponse(BaseModel):
    id: str
    route_name: str
    source: str
    destination: str
    created_at: str

    class Config:
        from_attributes = True


@router.post("/save", status_code=status.HTTP_201_CREATED)
async def save_route(
    payload: SaveRouteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    route = SavedRoute(
        user_id=current_user.id,
        route_name=payload.route_name,
        source=payload.source,
        destination=payload.destination,
    )
    db.add(route)
    await db.flush()
    await db.refresh(route)
    return {
        "id": route.id,
        "route_name": route.route_name,
        "source": route.source,
        "destination": route.destination,
        "created_at": route.created_at.isoformat() if route.created_at else None,
    }


@router.get("/")
async def list_routes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(SavedRoute).where(SavedRoute.user_id == current_user.id).order_by(SavedRoute.created_at.desc())
    rows = (await db.execute(q)).scalars().all()
    return [
        {
            "id": r.id,
            "route_name": r.route_name,
            "source": r.source,
            "destination": r.destination,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]


@router.delete("/{route_id}")
async def delete_route(
    route_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(SavedRoute).where(SavedRoute.id == route_id, SavedRoute.user_id == current_user.id)
    route = (await db.execute(q)).scalar_one_or_none()
    if route is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    await db.delete(route)
    await db.flush()
    return {"message": "Route deleted successfully"}
