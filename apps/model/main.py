import torch
from ultralytics import YOLO

# Load a pre-trained YOLO model (e.g., YOLOv8n)
device = 'cuda' if torch.cuda.is_available() else 'cpu'
device = 'mps' if torch.backends.mps.is_available() else device

model = YOLO('./output/last.pt')

# Train the model
# model.train(
#     data='./dataset/dataset.yaml', 
#     epochs=100, 
#     imgsz=640, 
#     batch=16,
#     patience=20,
#     device="mps",
# )

results = model(0, show=True)

# for result in results:
#     print(result.boxes.xyxy)  # x1, y1, x2, y2
#     print(result.boxes.conf)  # confidence score
#     print(result.boxes.cls)   # class index
