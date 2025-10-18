import torch
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
    device = "cuda" if torch.cuda.is_available() else "cpu"
    device = "mps" if torch.backends.mps.is_available() else device

    return model.predict(
        frame,
        conf=0.75,
        verbose=False,
        half=True,
        device=device,
        imgsz=640,
    )
