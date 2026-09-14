from datetime import datetime
from sqlalchemy import String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class PatientModel(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    encrypted_first_name: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_last_name: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_dob: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
