Backend — FastAPI Service

Run locally

- Create env: `python -m venv .venv` and activate it
- Install deps: `pip install -r requirements.txt`
- Start API: `uvicorn voice_api:app --reload --port 8000`

Notes

- CORS is enabled for `*` to simplify local development.
- File uploads are saved under `backend/uploads/`.
- Demo data is generated in-memory via `models/mock_data.py`.
