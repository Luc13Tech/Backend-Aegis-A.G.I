# Aegis A.G.I. — Autonomous Medical Billing & Insurance Claims Agent

Aegis A.G.I. est un agent intelligent conçu pour automatiser le cycle de facturation médicale et de gestion des demandes de remboursement d'assurance pour les cliniques américaines.

## 🚀 Fonctionnalités Principales (MVP)

1. **Vérification d'éligibilité patient (EDI 270/271 Mock)** : Interrogation de la couverture d'assurance avant la consultation.
2. **Scrubber de claims (Détection d'erreurs)** : Validation automatique des NPI, codes CPT/HCPCS et liaisons ICD-10 avant soumission.
3. **Génération CMS-1500** : Formatage standardisé des claims pour les clearinghouses.
4. **Rédaction d'Appeals par IA (Claude 3.5 Sonnet)** : Génération automatisée de lettres de contestation argumentées en cas de rejet.
5. **Conformité HIPAA par Design** : Chiffrement AES-256 des PHI au repos, logs d'audit immuables et sécurité JWT.

## 🛠️ Stack Technique

- **Backend** : Python 3.11+ / FastAPI / Pydantic v2
- **Base de données** : PostgreSQL / SQLAlchemy 2.0
- **Intelligence Artificielle** : API Anthropic Claude 3.5 Sonnet
- **Chiffrement & Sécurité** : Cryptography (Fernet AES-256)

## 📦 Installation et Lancement

1. **Cloner le repository et installer les dépendances** :
   ```bash
   cd aegis-agi/backend
   python -m venv venv
   source venv/bin/activate  # Sur Windows: venv\Scripts\activate
   pip install -r requirements.txt
