import numpy as np
from ultralytics import YOLO

_model_cache = {}


def load_model(model_path: str):
    if model_path not in _model_cache:
        _model_cache[model_path] = YOLO(model_path)

    return _model_cache[model_path]


def predict(
    model: YOLO,
    frame: np.ndarray,
):
    return model.predict(frame, conf=0.5, verbose=False)
