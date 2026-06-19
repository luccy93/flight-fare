from datetime import datetime
from pydantic import BaseModel


class PredictionRequest(BaseModel):
    airline: str
    source: str
    destination: str
    departure_date: str
    departure_time: str
    arrival_time: str
    total_stops: str | int
    cabin_class: str | None = None


class PredictionResponse(BaseModel):
    id: str
    airline: str
    source: str
    destination: str
    departure_date: str
    total_stops: str
    cabin_class: str | None
    predicted_price: float
    confidence_score: float
    price_category: str
    recommendation: str
    cheapest_booking_window: str
    created_at: str


class PredictionHistoryItem(BaseModel):
    id: str
    airline: str
    source: str
    destination: str
    departure_date: str
    predicted_price: float
    confidence_score: float | None
    price_category: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionHistoryResponse(BaseModel):
    predictions: list[PredictionHistoryItem]
    total: int
    page: int
    page_size: int
