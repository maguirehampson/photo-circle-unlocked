
import axios from 'axios';
import { DeepFaceAnalysis } from '@/components/photo-view/types';

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
    confidence?: {
      gender?: number;
      emotion?: number;
      ethnicity?: number;
    };
  };
} => {
  const id = `face-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Calculate confidence scores for each prediction
  let genderConfidence = 0;
  if (detection.gender) {
    const dominantGender = detection.dominant_gender === 'Woman' ? detection.gender.Woman : detection.gender.Man;
    genderConfidence = dominantGender;
  }
  
  let emotionConfidence = 0;
  if (detection.emotion && detection.dominant_emotion) {
    emotionConfidence = detection.emotion[detection.dominant_emotion.toLowerCase() as keyof typeof detection.emotion] || 0;
  }
  
  let ethnicityConfidence = 0;
  if (detection.race && detection.dominant_race) {
    const raceName = detection.dominant_race.replace('_', ' ');
    const raceKey = detection.dominant_race as keyof typeof detection.race;
    ethnicityConfidence = detection.race[raceKey] || 0;
  }
  
  // Extract demographics information when available
  const demographics = {
    age: detection.age,
    gender: detection.dominant_gender,
    emotion: detection.dominant_emotion,
    ethnicity: detection.dominant_race?.replace('_', ' '),
    confidence: {
      gender: genderConfidence,
      emotion: emotionConfidence,
      ethnicity: ethnicityConfidence
    }
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
    // In a real implementation, this would check if the Python DeepFace service is available
    // For this demo, we're simulating successful initialization
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
    
    // For demo purposes, we'll simulate a response with improved mock data
    const mockDetections = simulateImprovedDeepFaceDetection(imageElement.width, imageElement.height);
    
    return mockDetections.map(convertToPersonFormat);
  } catch (error) {
    console.error("Error detecting faces with DeepFace:", error);
    return [];
  }
};

// Helper function to simulate DeepFace detection response with improved accuracy
const simulateImprovedDeepFaceDetection = (imageWidth: number, imageHeight: number): FaceDetectionResult[] => {
  // Generate 1-3 random face detections with more accurate positioning
  const faceCount = Math.floor(Math.random() * 2) + 1; // Reduce number to 1-2 faces for more realistic results
  const detections: FaceDetectionResult[] = [];
  
  // Face positions are more realistic now
  const facePositions = [
    { x: 10, y: 15, w: 30, h: 35 }, // Left side of image
    { x: 60, y: 15, w: 30, h: 35 }, // Right side of image
  ];
  
  for (let i = 0; i < faceCount; i++) {
    // Use pre-defined positions instead of totally random ones
    const position = facePositions[i];
    
    // More realistic age ranges (25-45)
    const age = 25 + Math.floor(Math.random() * 20);
    
    // More realistic gender predictions with higher confidence
    const isMale = Math.random() > 0.5;
    const dominantGenderConfidence = 0.75 + (Math.random() * 0.2); // 75-95% confidence
    const gender = {
      Woman: isMale ? 1 - dominantGenderConfidence : dominantGenderConfidence,
      Man: isMale ? dominantGenderConfidence : 1 - dominantGenderConfidence
    };
    const dominant_gender = isMale ? "Man" : "Woman";
    
    // More realistic emotion distribution
    const neutralBase = 0.5 + (Math.random() * 0.3); // Neutral is usually higher in real analysis
    const emotions = {
      angry: Math.random() * 0.2,
      disgust: Math.random() * 0.1,
      fear: Math.random() * 0.1,
      happy: Math.random() * 0.4,
      sad: Math.random() * 0.2,
      surprise: Math.random() * 0.2,
      neutral: neutralBase
    };
    
    // Pick the highest emotion
    let highest = "neutral";
    let highestValue = neutralBase;
    
    Object.entries(emotions).forEach(([emotion, value]) => {
      if (value > highestValue) {
        highest = emotion;
        highestValue = value;
      }
    });
    
    // More realistic race/ethnicity distribution
    const races = {
      asian: Math.random() * 0.3,
      indian: Math.random() * 0.3,
      black: Math.random() * 0.3,
      white: Math.random() * 0.3,
      middle_eastern: Math.random() * 0.3,
      latino_hispanic: Math.random() * 0.3
    };
    
    // Pick the highest race
    let highestRace = "white";
    let highestRaceValue = races.white;
    
    Object.entries(races).forEach(([race, value]) => {
      if (value > highestRaceValue) {
        highestRace = race;
        highestRaceValue = value;
      }
    });
    
    // Ensure the dominant value is higher than others
    races[highestRace as keyof typeof races] = highestRaceValue + 0.2;
    
    const detection: FaceDetectionResult = {
      region: { 
        x: position.x, 
        y: position.y, 
        w: position.w, 
        h: position.h 
      },
      confidence: 0.9 + Math.random() * 0.1, // 90-100% confidence for face detection
      age: age,
      gender: gender,
      dominant_gender: dominant_gender,
      emotion: emotions,
      dominant_emotion: highest,
      race: races,
      dominant_race: highestRace
    };
    
    detections.push(detection);
  }
  
  return detections;
};

// Face comparison functionality
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

// Process a single image for demographics analysis
export const analyzeImageWithDeepFace = async (
  imageElement: HTMLImageElement
): Promise<DeepFaceAnalysis[]> => {
  try {
    console.log("Analyzing image for demographics with DeepFace...");
    
    // In a real implementation, you would convert the image and send to backend
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(imageElement, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg');
    
    // For demo, return simulated analysis results
    const faceCount = Math.floor(Math.random() * 2) + 1;
    const results: DeepFaceAnalysis[] = [];
    
    for (let i = 0; i < faceCount; i++) {
      results.push({
        age: Math.floor(25 + Math.random() * 20),
        gender: {
          Woman: Math.random(),
          Man: Math.random()
        },
        dominant_gender: Math.random() > 0.5 ? "Woman" : "Man",
        emotion: {
          angry: Math.random() * 0.2,
          disgust: Math.random() * 0.1,
          fear: Math.random() * 0.1,
          happy: Math.random() * 0.4,
          sad: Math.random() * 0.2,
          surprise: Math.random() * 0.2,
          neutral: 0.5 + Math.random() * 0.3
        },
        dominant_emotion: ["happy", "neutral"][Math.floor(Math.random() * 2)],
        race: {
          asian: Math.random() * 0.3,
          indian: Math.random() * 0.3,
          black: Math.random() * 0.3,
          white: Math.random() * 0.3,
          middle_eastern: Math.random() * 0.3,
          latino_hispanic: Math.random() * 0.3
        },
        dominant_race: ["asian", "white", "black"][Math.floor(Math.random() * 3)]
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error analyzing image with DeepFace:", error);
    return [];
  }
};
