import cv2
import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import base64
import json

import utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/challenge")
async def get_challenge():
    return {}


@app.post("/predict")
async def predict():
    return {}


@app.post("/verify")
async def verify():
    return {}


@app.websocket("/ws/predict")
async def predict_ws(sock: WebSocket):
    await sock.accept()
    model_path = "/Users/gusbell/Developer/projects/mlproj/apps/model/output/best.pt"
    model = utils.load_model(model_path)

    try:
        while True:
            data = await sock.receive_text()

            try:
                image_parts = data.split(",", 1)
                if len(image_parts) < 2:
                    await sock.send_json({"c": 400, "m": "Invalid image"})
                    continue

                image_bytes = base64.b64decode(image_parts[1])

                if len(image_bytes) == 0:
                    await sock.send_json({"c": 400, "m": "Invalid image"})
                    continue

                nparr = np.frombuffer(image_bytes, np.uint8)

                if nparr.size == 0:
                    await sock.send_json({"c": 400, "m": "Invalid image"})
                    continue

                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if frame is None or frame.size == 0:
                    await sock.send_json({"c": 400, "m": "Invalid image"})
                    continue

                # frame = cv2.resize(frame, (640, 480))

                results = utils.predict_stream(model, frame)
                result = results[0]

                annotated_frame = result.plot()
                # annotated_frame = cv2.resize(annotated_frame, (640, 480))

                _, buffer = cv2.imencode(
                    ".jpg",
                    annotated_frame,
                    [
                        int(cv2.IMWRITE_JPEG_QUALITY),
                        75,
                        int(cv2.IMWRITE_JPEG_OPTIMIZE),
                        1,
                    ],
                )
                img_base64 = base64.b64encode(buffer).decode("utf-8")

                await sock.send_json(
                    {
                        "c": 200,
                        "i": f"data:image/jpeg;base64,{img_base64}",
                        "d": json.loads(result.to_json()),
                    }
                )

            except Exception as e:
                await sock.send_json({"c": 500, "e": f"Error: {str(e)}"})
                continue

    except Exception:
        pass
    finally:
        try:
            await sock.close()
        except:
            pass
