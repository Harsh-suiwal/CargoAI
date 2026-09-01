# CargoAI

Predictive Freight Intelligence for Smarter Vessel Chartering.
Team Bug Slayer — IIIT Sonepat — Code Build 2026.

## Project structure

```
cargoai/
├── cargoai-backend/     Express app: serves the frontend + REST API
└── cargoai-ml/          Python FastAPI service: forecasting + feasibility models
```

## How the two pieces talk to each other

Browser → Express (`cargoai-backend`, port 3000) → Python ML service (`cargoai-ml`, port 8000)

Express never runs the ML itself — it calls the Python service over HTTP
(see `cargoai-backend/src/services/mlClient.js`) and passes the JSON result
back to the frontend.

## Running it locally

### 1. Start the ML service (Python)

```bash
cd cargoai-ml
python -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Check it's alive: open http://localhost:8000 — you should see
`{"status": "CargoAI ML service is running"}`.

### 2. Start the backend (Node/Express)

In a second terminal:

```bash
cd cargoai-backend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## What's implemented right now (MVP)

- **Forecast model** (`cargoai-ml/models/freight_forecast.py`): moving average
  + linear trend on sample historical data. This is a placeholder — swap in
  Prophet later without changing the function signature.
- **Feasibility model** (`cargoai-ml/models/vessel_feasibility.py`): rule-based
  checks on vessel size vs. port limits, plus a fixed congestion-risk lookup.
  Placeholder for a trained XGBoost/LightGBM model later.
- **Pages**: landing page, cargo submission form, forecast viewer, dashboard —
  all plain HTML/CSS/JS served by Express, no frontend framework.

## Next upgrade steps

1. Replace `historical_rates.csv` with real freight rate data.
2. Swap the moving-average model for Prophet.
3. Train an XGBoost/LightGBM model on real voyage outcomes for feasibility + risk.
4. Wire up Postgres (`cargoai-backend/src/services/db.js`) to persist submitted
   cargo requirements instead of using hardcoded demo values.
