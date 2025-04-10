from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import cv2
import numpy as np
import os
import json
from datetime import datetime
from typing import List, Dict, Any
import base64
from PIL import Image
import io
from face_learning_model import FaceLearningModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the face learning model
face_model = FaceLearningModel()

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Face Recognition API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .upload-form { margin: 20px 0; }
                .results { margin-top: 20px; }
                img { max-width: 100%; height: auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Face Recognition API</h1>
                <form class="upload-form" action="/process-image" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" accept="image/*">
                    <button type="submit">Process Image</button>
                </form>
                <div class="results" id="results"></div>
            </div>
            <script>
                document.querySelector('form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const response = await fetch('/process-image', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    document.getElementById('results').innerHTML = `
                        <h2>Results</h2>
                        <img src="data:image/jpeg;base64,${data.visualization}" alt="Processed Image">
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                });
            </script>
        </body>
    </html>
    """

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    """Process an image and return face recognition results with visualization"""
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Save temporarily
        temp_path = f"temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        cv2.imwrite(temp_path, image)
        
        # Process image
        results = face_model.process_image(temp_path)
        
        # Create visualization
        vis_image = image.copy()
        for face in results:
            location = face['location']
            person_id = face['person_id']
            confidence = face['confidence']
            
            # Draw rectangle
            cv2.rectangle(vis_image, 
                         (location['left'], location['top']), 
                         (location['right'], location['bottom']), 
                         (0, 255, 0), 2)
            
            # Draw label
            label = f"{person_id} ({confidence:.2f})"
            cv2.putText(vis_image, label, (location['left'], location['top'] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Add quality metrics
            quality = face['quality']
            metrics_text = f"B:{quality['brightness']:.2f} S:{quality['sharpness']:.2f} C:{quality['contrast']:.2f}"
            cv2.putText(vis_image, metrics_text, (location['left'], location['bottom'] + 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', vis_image)
        vis_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Clean up
        os.remove(temp_path)
        
        return {
            "faces_detected": len(results),
            "face_details": results,
            "visualization": vis_base64
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-stats")
async def get_model_stats():
    """Get current model statistics"""
    try:
        stats = face_model.get_person_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train-batch")
async def train_batch(files: List[UploadFile] = File(...)):
    """Process multiple images in a batch"""
    try:
        results = []
        for file in files:
            # Read image file
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Save temporarily
            temp_path = f"temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            cv2.imwrite(temp_path, image)
            
            # Process image
            result = face_model.process_image(temp_path)
            results.append({
                "filename": file.filename,
                "results": result
            })
            
            # Clean up
            os.remove(temp_path)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export-model")
async def export_model():
    """Export current model data"""
    try:
        export_path = f"model_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        face_model.export_model_data(export_path)
        return FileResponse(export_path, media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 