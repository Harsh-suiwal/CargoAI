# models/vessel_feasibility.py
#
# MVP feasibility model: rule-based checks on vessel size vs. port limits,
# plus a simple congestion-risk heuristic. This stands in for the real
# XGBoost/LightGBM feasibility + risk models until enough labeled voyage
# outcome data exists to train them.
#
# Upgrade path: replace the body of assess_feasibility() with a trained
# model's .predict() call — the function signature and return shape stay
# the same so the Express side never needs to change.

# Rough max vessel-size limits per port (illustrative placeholder data).
PORT_LIMITS = {
    "Paradip": {"maxDWT": 180000},
    "Vizag": {"maxDWT": 150000},
    "Gangavaram": {"maxDWT": 200000},
    "Gopalpur": {"maxDWT": 100000},
    "Dhamra": {"maxDWT": 200000},
    "Sagar-Sandheads": {"maxDWT": 100000},
    "Haldia": {"maxDWT": 50000},
}

# Approximate deadweight tonnage by vessel type (illustrative placeholder data).
VESSEL_DWT = {
    "Handysize": 35000,
    "Supramax": 58000,
    "Panamax": 80000,
    "Capesize": 180000,
}

# Baseline congestion risk by port (illustrative placeholder data).
PORT_CONGESTION = {
    "Paradip": "MEDIUM",
    "Vizag": "LOW",
    "Gangavaram": "LOW",
    "Gopalpur": "MEDIUM",
    "Dhamra": "MEDIUM",
    "Sagar-Sandheads": "HIGH",
    "Haldia": "HIGH",
}


def assess_feasibility(cargo_type: str, quantity_mt: float, vessel_type: str, destination: str) -> dict:
    vessel_dwt = VESSEL_DWT.get(vessel_type, 80000)
    port_limit = PORT_LIMITS.get(destination, {}).get("maxDWT", 150000)

    fits_port = vessel_dwt <= port_limit
    fits_cargo = quantity_mt <= vessel_dwt

    passed = fits_port and fits_cargo
    risk = PORT_CONGESTION.get(destination, "MEDIUM")

    return {
        "pass": passed,
        "risk": risk,
        "details": {
            "vesselDWT": vessel_dwt,
            "portMaxDWT": port_limit,
            "fitsPort": fits_port,
            "fitsCargoQuantity": fits_cargo,
        },
    }
