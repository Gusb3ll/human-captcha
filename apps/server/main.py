from fastapi import FastAPI
from fastapi.responses import FileResponse

import utils

app = FastAPI()

@app.get("/")
def predict():
    image_path = "/Users/gusbell/Developer/projects/mlproj/apps/server/test.jpg"
    model_path = "/Users/gusbell/Developer/projects/mlproj/apps/model/output/yolo11n-pose-train-best.pt"
    output_path = "/Users/gusbell/Developer/projects/mlproj/apps/server/output.jpg"

    result = utils.predict(image_path, model_path)
    
    # Save the annotated image
    result[0].save(output_path)
    
    return FileResponse(output_path, media_type="image/jpeg")
