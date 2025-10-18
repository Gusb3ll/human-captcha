import cv2
import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import base64
import json
import random

import utils
import constants

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
    challenges = constants.challenges
    challenge = random.choice(challenges)

    return {"c": 0, "d": challenge}


@app.websocket("/ws/predict")
async def predict_ws(sock: WebSocket):
    try:
        await sock.accept()
        model = utils.load_model(constants.config["model_path"])

        while True:
            data = await sock.receive_text()

            try:
                global frame

                try:
                    image_bytes = base64.b64decode(data)

                    nparr = np.frombuffer(image_bytes, np.uint8)
                    if nparr.size == 0:
                        raise Exception

                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if frame is None or frame.size == 0:
                        raise Exception
                except Exception:
                    await sock.send_json({"c": 1, "m": "Invalid image"})
                    continue

                results = utils.predict(model, frame)
                result = results[0]

                await sock.send_json(
                    {
                        "c": 0,
                        "d": json.loads(result.to_json()),
                    }
                )
            except Exception as e:
                await sock.send_json({"c": 2, "e": str(e)})
                continue
    except Exception:
        pass
