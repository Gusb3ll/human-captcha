from ultralytics import YOLO

def predict(image_path: str, model_path: str):
  model = YOLO(model_path)
  results = model(image_path)

  return results