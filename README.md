# CargoAI — MVP Submission

**Team Bug Slayer | Code Build 2026 | IIIT Sonepat**

CargoAI is a full-stack dashboard for predicting freight rates and evaluating vessel voyage feasibility.

**MVP Status Note:** The entire system architecture (Frontend → Express Backend → Python FastAPI Microservice) is fully connected and successfully passing payloads. To hit the MVP submission deadline and guarantee system uptime, the ML models (`/forecast` and `/feasibility`) are currently running in a fallback mock-data mode. We have the core Scikit-learn/Pandas logic built, but we encountered data-structure mismatches with our CSV datasets at the 11th hour. We stubbed the endpoints to ensure the UI and API pipeline can be evaluated end-to-end today, and we will wire the actual `.joblib` models back in once the dataset columns are normalized.

---

### Project Structure

We split the stack to let Node handle the web traffic and Python handle the data processing.

* `/cargoai-backend/` - Node.js/Express app. Serves the HTML views and acts as an API proxy.
* `/cargoai-ml/` - Python FastAPI microservice. Contains the ML pipeline and endpoints.

### 1. Run the ML Service (Python)

The ML service runs on port 8000 and handles the heavy lifting. Open a terminal and run:

```powershell
cd cargoai-ml
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

```

*Verify it's running by visiting `http://localhost:8000` in your browser.*

### 2. Run the Web Backend (Node.js)

The Express server runs on port 3000, serving the UI and routing requests to the Python service. Open a second terminal:

```powershell
cd cargoai-backend
npm install
npm run dev

```

Open `http://localhost:3000` to view the dashboard.

---

### What is working today

* **End-to-End Pipeline:** The browser communicates with the Node backend, which successfully builds payloads and calls the Python microservice, mapping the returned data back to the UI.
* **Dashboard View:** Aggregates forecast and feasibility data to render voyage decisions.
* **Forecast Engine (Bypass Mode):** Endpoint is active and accepts standard route/cargo JSON payloads. Currently returning a mocked linear trend to bypass a dataset KeyError.
* **Feasibility Engine (Bypass Mode):** Endpoint is active. Currently returning static risk margins to ensure UI rendering.
* **Cargo Form:** Captures user voyage requirements and evaluates them against the pipeline.

### Post-MVP Roadmap

1. **Fix Dataset Pipelines:** Re-map the `historical_rates.csv` headers to match the Python `freight_forecast.py` dictionaries and reactivate the GradientBoostingRegressor.
2. **Prophet Integration:** Swap the fallback moving-average model for Prophet for better time-series forecasting.
3. **Database Persistence:** Wire up `src/services/db.js` with PostgreSQL to save the user's evaluated voyages instead of rendering them once in memory.
