from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.prediction import PredictionRequest, PredictionResponse, PredictionHistoryResponse
from app.services.prediction_service import make_prediction, get_prediction_history, get_prediction_by_id

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse)
@router.post("/predict", response_model=PredictionResponse)
async def predict(
    payload: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    features = {
        "Airline": payload.airline,
        "Source": payload.source,
        "Destination": payload.destination,
        "Date_of_Journey": payload.departure_date,
        "Dep_Time": payload.departure_time,
        "Arrival_Time": payload.arrival_time,
        "Total_Stops": payload.total_stops,
        "Cabin_Class": payload.cabin_class or "",
    }
    result = await make_prediction(features, current_user.id, db)
    pred = await get_prediction_by_id(result["prediction_id"], current_user.id, db)
    return PredictionResponse(
        id=pred["id"],
        airline=pred["airline"],
        source=pred["source"],
        destination=pred["destination"],
        departure_date=pred["departure_date"],
        total_stops=pred["total_stops"],
        cabin_class=pred["cabin_class"],
        predicted_price=result["predicted_price"],
        confidence_score=result["confidence_score"],
        price_category=result["price_category"],
        recommendation=result["recommendation"],
        cheapest_booking_window=result["cheapest_booking_window"],
        created_at=pred["created_at"],
    )


@router.get("/history", response_model=PredictionHistoryResponse)
async def history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await get_prediction_history(current_user.id, db, page=page, page_size=page_size)
    return result


@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await get_prediction_by_id(prediction_id, current_user.id, db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found")
    return result
