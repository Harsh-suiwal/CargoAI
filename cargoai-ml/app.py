# app.py
# FastAPI service exposing CargoAI's ML endpoints.
# Run with: uvicorn app:app --reload --port 8000

from fastapi import FastAPI
from pydantic import BaseModel

from models.freight_forecast import predict_forecast
from models.vessel_feasibility import assess_feasibility

app = FastAPI(title="CargoAI ML Service")


class ForecastRequest(BaseModel):
    route: str


class FeasibilityRequest(BaseModel):
    cargoType: str
    quantityMT: float
    vesselType: str
    origin: str
    destination: str


@app.get("/")
def health_check():
    return {"status": "CargoAI ML service is running"}


@app.post("/predict/forecast")
def predict_forecast_endpoint(req: ForecastRequest):
    return predict_forecast(req.route)


@app.post("/predict/feasibility")
def predict_feasibility_endpoint(req: FeasibilityRequest):
    return assess_feasibility(
        cargo_type=req.cargoType,
        quantity_mt=req.quantityMT,
        vessel_type=req.vesselType,
        destination=req.destination,
    )
