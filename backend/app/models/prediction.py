import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    airline: Mapped[str] = mapped_column(String(100), nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    departure_date: Mapped[str] = mapped_column(String(20), nullable=False)
    departure_time: Mapped[str] = mapped_column(String(10), nullable=False)
    arrival_time: Mapped[str] = mapped_column(String(10), nullable=False)
    total_stops: Mapped[str] = mapped_column(String(20), nullable=False)
    cabin_class: Mapped[str] = mapped_column(String(50), nullable=True)
    predicted_price: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=True)
    price_category: Mapped[str] = mapped_column(String(20), nullable=True)
    recommendation: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
