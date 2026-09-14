import logging
from datetime import datetime
from typing import Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.audit import AuditLogModel

logger = logging.getLogger("hipaa_audit")
logger.setLevel(logging.INFO)

class HIPAAAuditMiddleware(BaseHTTPMiddleware):
    """
    Middleware qui enregistre chaque requête API touchant aux PHI
    dans un journal d'audit conforme HIPAA.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Filtrer et journaliser uniquement les routes API
        if request.url.path.startswith("/api/v1"):
            user_id = getattr(request.state, "user_id", "anonymous")
            client_ip = request.client.host if request.client else "unknown"
            
            db: Session = SessionLocal()
            try:
                audit_entry = AuditLogModel(
                    user_id=user_id,
                    action=f"{request.method} {request.url.path}",
                    resource_accessed=request.url.path,
                    ip_address=client_ip,
                    status_code=response.status_code,
                    timestamp=datetime.utcnow()
                )
                db.add(audit_entry)
                db.commit()
            except Exception as e:
                logger.error(f"Erreur lors de l'enregistrement du log d'audit HIPAA: {e}")
                db.rollback()
            finally:
                db.close()
                
        return response


def log_phi_access(db: Session, user_id: str, action: str, patient_id: str, details: Optional[str] = None):
    """
    Fonction utilitaire pour enregistrer un accès explicite à un dossier patient spécifique.
    """
    log_entry = AuditLogModel(
        user_id=user_id,
        action=action,
        resource_accessed=f"patient:{patient_id}",
        ip_address="internal_service",
        status_code=200,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(log_entry)
    db.commit()
