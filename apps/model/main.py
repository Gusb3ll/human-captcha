import torch
from ultralytics import YOLO

device = "cuda" if torch.cuda.is_available() else "cpu"

model = YOLO("./base/yolo11l-pose.pt")

model.train(
    data="./dataset/dataset.yaml",
    epochs=150,
    imgsz=640,
    batch=16,
    patience=20,
    device=device,
)

# model(0, show=True)
model.export(format="onnx")
