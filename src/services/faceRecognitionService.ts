
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface FaceQualityMetrics {
  brightness: number;
  sharpness: number;
  contrast: number;
}

export interface FaceDetails {
  person_id: string;
  confidence: number;
  quality_metrics: FaceQualityMetrics;
  location: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface FaceRecognitionResult {
  faces_detected: number;
  face_details: FaceDetails[];
  visualization?: string; // Base64 encoded image with visualizations
}

export const processImage = async (imageFile: File): Promise<FaceRecognitionResult> => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axios.post(`${API_URL}/process-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image. Make sure the API server is running.');
  }
};

export const getModelStats = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/model-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model stats:', error);
    throw new Error('Failed to fetch model statistics');
  }
};

// Function to convert raw API results to a more suitable format for the frontend
export const enhanceFaceRecognitionResults = (results: FaceRecognitionResult): FaceRecognitionResult => {
  if (!results.face_details) return results;
  
  // Add extra processing or normalization of results if needed
  const enhancedFaceDetails = results.face_details.map(face => ({
    ...face,
    // Ensure all values are within 0-1 range
    quality_metrics: {
      brightness: Math.min(1, Math.max(0, face.quality_metrics.brightness)),
      sharpness: Math.min(1, Math.max(0, face.quality_metrics.sharpness)),
      contrast: Math.min(1, Math.max(0, face.quality_metrics.contrast)),
    }
  }));

  return {
    ...results,
    face_details: enhancedFaceDetails
  };
};
