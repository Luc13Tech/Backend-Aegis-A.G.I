from datetime import datetime
from sqlalchemy import String, DateTime, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ClaimModel(Base):
    __tablename__ = "claims"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    patient_id: Mapped[str] = mapped_column(String, index=True)
    provider_npi: Mapped[str] = mapped_column(String(10), nullable=False)
    payer_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="DRAFT")  # DRAFT, VALIDATED, SUBMITTED, REJECTED
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    line_items_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
