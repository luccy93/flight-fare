import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
_ML_PREDICT_PATH = os.path.join(_PROJECT_ROOT, "ml", "predict.py")

if _ML_PREDICT_PATH not in sys.path:
    sys.path.insert(0, os.path.dirname(_ML_PREDICT_PATH))

import importlib.util
spec = importlib.util.spec_from_file_location("ml_predict", _ML_PREDICT_PATH)
ml_predict_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ml_predict_module)


def _translate_features(features: dict) -> dict:
    field_map = {
        "airline": "Airline",
        "source": "Source",
        "destination": "Destination",
        "departure_date": "Date_of_Journey",
        "departure_time": "Dep_Time",
        "arrival_time": "Arrival_Time",
        "total_stops": "Total_Stops",
        "cabin_class": "Cabin_Class",
    }
    translated = {}
    for our_key, ml_key in field_map.items():
        if our_key in features:
            translated[ml_key] = features[our_key]
        elif ml_key in features:
            translated[ml_key] = features[ml_key]
    if "Duration" not in translated and "departure_time" in features and "arrival_time" in features:
        translated["Duration"] = _compute_duration(
            features.get("departure_time", ""), features.get("arrival_time", "")
        )
    return translated


def _compute_duration(dep: str, arr: str) -> str:
    try:
        dep_h, dep_m = map(int, dep.split(":"))
        arr_h, arr_m = map(int, arr.split(":"))
        dep_total = dep_h * 60 + dep_m
        arr_total = arr_h * 60 + arr_m
        if arr_total < dep_total:
            arr_total += 24 * 60
        diff = arr_total - dep_total
        h, m = divmod(diff, 60)
        return f"{h}h {m}m"
    except Exception:
        return "2h 0m"


async def predict(features: dict) -> dict:
    ml_input = _translate_features(features)
    result = ml_predict_module.predict(ml_input)
    return result
