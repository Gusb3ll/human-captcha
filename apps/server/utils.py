import cv2
import numpy as np
from ultralytics import YOLO

_model_cache = {}

def load_model(model_path: str):
  if (model_path not in _model_cache):
    _model_cache[model_path] = YOLO(model_path)

  return _model_cache[model_path]

# def predict(image: np.ndarray, model_path: str):
#   model = load_model(model_path)
#   results = model.predict(image, conf=0.5)

#   return results

def predict_stream(model: YOLO, frame: np.ndarray, ):
  results = model.predict(frame, conf=0.5, verbose=False)

  return results
