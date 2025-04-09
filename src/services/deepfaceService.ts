
import axios from 'axios';

// Types for DeepFace API responses
interface FaceDetectionResult {
  region: {
    x: number;
    y: number; 
    w: number;
    h: number;
  };
  confidence: number;
  age?: number;
  gender?: {
    Woman: number;
    Man: number;
  };
  dominant_gender?: string;
  emotion?: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    sad: number;
    surprise: number;
    neutral: number;
  };
  dominant_emotion?: string;
  race?: {
    asian: number;
    indian: number;
    black: number;
    white: number;
    middle_eastern: number;
    latino_hispanic: number;
  };
  dominant_race?: string;
}

interface DeepFaceResponse {
  results: FaceDetectionResult[];
}

// Convert DeepFace face detection format to our app's format
const convertToPersonFormat = (detection: FaceDetectionResult): {
  id: string;
  name: string;
  facePosition: { x: number; y: number; width: number; height: number };
  demographics?: {
    age?: number;
    gender?: string;
    emotion?: string;
    ethnicity?: string;
  };
} => {
  const id = `face-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract demographics information when available
  const demographics = {
    age: detection.age,
    gender: detection.dominant_gender,
    emotion: detection.dominant_emotion,
    ethnicity: detection.dominant_race?.replace('_', ' ')
  };

  return {
    id,
    name: "Unknown Person",
    facePosition: {
      x: detection.region.x,
      y: detection.region.y,
      width: detection.region.w,
      height: detection.region.h
    },
    demographics
  };
};

// Initialize DeepFace service
export const initializeDeepFace = async (): Promise<boolean> => {
  try {
    // This would check if DeepFace service is available and ready
    // For real implementation, this could check server availability
    console.log("Initializing DeepFace service...");
    return true;
  } catch (error) {
    console.error("Failed to initialize DeepFace:", error);
    return false;
  }
};

// Detect faces in an image using DeepFace
export const detectFacesWithDeepFace = async (imageElement: HTMLImageElement): Promise<any[]> => {
  try {
    // Since we can't directly call DeepFace from browser (Python library),
    // we would typically send the image to a backend service
    // This is a mock implementation

    console.log("Detecting faces with DeepFace...");
    
    // Convert image to base64 for sending to server
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(imageElement, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg');

    // In a real implementation, you would call your backend API
    // Example: const response = await axios.post('/api/detect-faces', { image: base64Image });
    
    // For demo purposes, we'll simulate a response with mock data
    // In production, replace this with actual API call to DeepFace backend
    const mockDetections = simulateDeepFaceDetection(imageElement.width, imageElement.height);
    
    return mockDetections.map(convertToPersonFormat);
  } catch (error) {
    console.error("Error detecting faces with DeepFace:", error);
    return [];
  }
};

// Helper function to simulate DeepFace detection response
// In a real implementation, this would be replaced with actual API call
const simulateDeepFaceDetection = (imageWidth: number, imageHeight: number): FaceDetectionResult[] => {
  // Generate 1-3 random face detections
  const faceCount = Math.floor(Math.random() * 3) + 1;
  const detections: FaceDetectionResult[] = [];
  
  for (let i = 0; i < faceCount; i++) {
    // Create random face position that makes sense
    const faceWidth = Math.floor(imageWidth * (0.15 + Math.random() * 0.2)); // 15-35% of image width
    const faceHeight = Math.floor(imageHeight * (0.2 + Math.random() * 0.3)); // 20-50% of image height
    const x = Math.floor(Math.random() * (imageWidth - faceWidth));
    const y = Math.floor(Math.random() * (imageHeight - faceHeight));
    
    const emotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"];
    const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const races = ["asian", "indian", "black", "white", "middle_eastern", "latino_hispanic"];
    const dominantRace = races[Math.floor(Math.random() * races.length)];
    
    const detection: FaceDetectionResult = {
      region: { x, y, w: faceWidth, h: faceHeight },
      confidence: 0.8 + Math.random() * 0.2, // 80-100% confidence
      age: Math.floor(20 + Math.random() * 40), // Age 20-60
      gender: {
        Woman: Math.random(),
        Man: Math.random()
      },
      dominant_gender: Math.random() > 0.5 ? "Woman" : "Man",
      emotion: {
        angry: Math.random(),
        disgust: Math.random(),
        fear: Math.random(),
        happy: Math.random(),
        sad: Math.random(),
        surprise: Math.random(),
        neutral: Math.random()
      },
      dominant_emotion: dominantEmotion,
      race: {
        asian: Math.random(),
        indian: Math.random(),
        black: Math.random(),
        white: Math.random(),
        middle_eastern: Math.random(),
        latino_hispanic: Math.random()
      },
      dominant_race: dominantRace
    };
    
    detections.push(detection);
  }
  
  return detections;
};

// In a real implementation, you would add functions to:
// 1. Compare faces for identity matching
// 2. Recognize known faces from a database
// 3. Other DeepFace capabilities

export const compareFacesWithDeepFace = async (face1: string, face2: string): Promise<{
  verified: boolean;
  distance: number;
  threshold: number;
}> => {
  try {
    // This would be an API call to DeepFace backend
    // For demo, return mock comparison result
    return {
      verified: Math.random() > 0.5,
      distance: Math.random() * 0.8,
      threshold: 0.6
    };
  } catch (error) {
    console.error("Error comparing faces:", error);
    return {
      verified: false,
      distance: 1,
      threshold: 0.6
    };
  }
};
