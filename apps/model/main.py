import torch
from ultralytics import YOLO

# Load a pre-trained YOLO model (e.g., YOLOv8n)
device = "cuda" if torch.cuda.is_available() else "cpu"
device = "mps" if torch.backends.mps.is_available() else device

model = YOLO("./output/last.pt")

# Train the model
model.train(
    data="./dataset/dataset.yaml",
    epochs=150,  # Increase if using early stopping
    imgsz=640,
    batch=16,
    patience=20,  # Good - stops if no improvement for 20 epochs
    device="mps",
    # Data Augmentation (helps prevent overfitting)
    hsv_h=0.015,  # HSV-Hue augmentation
    hsv_s=0.7,  # HSV-Saturation augmentation
    hsv_v=0.4,  # HSV-Value augmentation
    degrees=10.0,  # Rotation (+/- degrees)
    translate=0.1,  # Translation (+/- fraction)
    scale=0.5,  # Scale (+/- gain)
    shear=0.0,  # Shear (+/- degrees)
    perspective=0.0,  # Perspective (+/- fraction)
    flipud=0.0,  # Flip up-down (probability)
    fliplr=0.5,  # Flip left-right (probability)
    mosaic=1.0,  # Mosaic augmentation (probability)
    mixup=0.1,  # Mixup augmentation (probability)
    copy_paste=0.0,  # Copy-paste augmentation (probability)
    # Regularization
    dropout=0.1,  # Dropout (helps prevent overfitting)
    weight_decay=0.0005,  # L2 regularization
    # Learning Rate Strategy
    lr0=0.01,  # Initial learning rate
    lrf=0.01,  # Final learning rate (lr0 * lrf)
    momentum=0.937,  # SGD momentum/Adam beta1
    warmup_epochs=3.0,  # Warmup epochs
    warmup_momentum=0.8,  # Warmup initial momentum
    # Loss Weights (tune based on your task)
    box=7.5,  # Box loss gain
    cls=0.5,  # Class loss gain
    dfl=1.5,  # DFL loss gain
    pose=12.0,  # Pose loss gain (important for pose estimation)
    kobj=1.0,  # Keypoint objectness loss gain
    # Optimization
    optimizer="auto",  # 'SGD', 'Adam', 'AdamW', or 'auto'
    close_mosaic=10,  # Disable mosaic for last N epochs
    # Model EMA
    ema=True,  # Use Exponential Moving Average
    # Save/Resume
    save=True,
    save_period=-1,  # Save checkpoint every x epochs (-1 = only last)
    resume=False,  # Resume from last checkpoint
    # Performance
    amp=True,  # Automatic Mixed Precision training
    plots=True,  # Save training plots
    # Validation
    val=True,  # Validate during training
)

results = model(0, show=True)

# for result in results:
#     print(result.boxes.xyxy)  # x1, y1, x2, y2
#     print(result.boxes.conf)  # confidence score
#     print(result.boxes.cls)   # class index
