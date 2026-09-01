# models/freight_forecast.py
#
# MVP forecasting model: simple moving average + linear trend extrapolation.
# This is intentionally simple so the pipeline works end-to-end first.
# Upgrade path: swap this out for Facebook Prophet without changing the
# function signature (predict_forecast still returns the same shape).

import os
import pandas as pd
import numpy as np
from datetime import timedelta

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "historical_rates.csv")


def _load_route_data(route: str) -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH, parse_dates=["date"])
    route_df = df[df["route"] == route].sort_values("date")
    return route_df


def predict_forecast(route: str, periods: int = 4, window: int = 3) -> dict:
    """
    Returns a simple forecast for the given route.

    - Uses a moving average of the last `window` points as the base level.
    - Extrapolates a linear trend from the last `window` points forward.
    - `periods` = number of future weekly points to generate.
    """
    route_df = _load_route_data(route)

    if route_df.empty:
        # No historical data for this route yet — return a flat placeholder
        # so the frontend still has something sensible to show.
        today = pd.Timestamp.today().normalize()
        forecast_points = [
            {"date": (today + timedelta(weeks=i + 1)).strftime("%Y-%m-%d"), "predictedRate": 15.0}
            for i in range(periods)
        ]
        return {"route": route, "forecast": forecast_points, "trend": "UNKNOWN (no data)"}

    rates = route_df["rate_usd_per_mt"].values
    dates = route_df["date"].values

    recent = rates[-window:]
    moving_avg = float(np.mean(recent))

    # crude linear trend: average week-over-week change over the recent window
    diffs = np.diff(recent)
    avg_change = float(np.mean(diffs)) if len(diffs) > 0 else 0.0

    last_date = pd.Timestamp(dates[-1])
    forecast_points = []
    level = moving_avg
    for i in range(periods):
        level = level + avg_change
        next_date = last_date + timedelta(weeks=i + 1)
        forecast_points.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "predictedRate": round(level, 2),
        })

    trend = "RISING" if avg_change > 0.05 else "FALLING" if avg_change < -0.05 else "STABLE"

    return {"route": route, "forecast": forecast_points, "trend": trend}
