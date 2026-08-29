# Intelligent Freight Quote Generation System - Combined Project

This package combines:
- Your existing FreightIQ React frontend under `FreightIQ/client/`
- The teammate Django backend under `backend/`

The teammate `client/` was intentionally NOT copied over your frontend to avoid overwriting your work.
The backend `.env` file was intentionally excluded; use `.env.example` and add your own local secrets.

## Frontend
```powershell
cd FreightIQ\client
npm install
npm run dev
```

## Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend and backend are not yet API-connected by this merge; this package preserves both codebases so they can be connected safely next.
