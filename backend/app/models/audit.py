from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class AuditLogModel(Base):
    """
    Table d'audit conforme HIPAA pour tracer les accès, modifications
    et suppressions de données de santé (PHI).
    """
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_primary=True, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String, index=True, default="system")
    action: Mapped[str] = mapped_column(String, nullable=False)
    resource_accessed: Mapped[str] = mapped_column(String, nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    status_code: Mapped[int] = mapped_column(Integer, nullable=False)
    details: Mapped[str] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
