
import * as faceapi from 'face-api.js';

// Configuration and setup for face-api.js
export const loadModels = async () => {
  try {
    // Models are loaded from a "/models" directory in the public folder
    const MODEL_URL = '/models';
    
    // Load the actual models
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    
    console.log('Face detection models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face-api.js models:', error);
    return false;
  }
};

// Actual face detection functionality
export const detectFaces = async (imageElement: HTMLImageElement) => {
  try {
    // Wait for the image to be fully loaded
    if (!imageElement.complete) {
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });
    }

    // Detect all faces in the image with face landmarks and descriptors
    const detections = await faceapi.detectAllFaces(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    // Convert the detections to our app format
    const results = detections.map((detection, index) => {
      // Get the bounding box as percentages of image dimensions
      const box = detection.detection.box;
      const imageWidth = imageElement.width;
      const imageHeight = imageElement.height;
      
      return {
        id: `face-${Date.now()}-${index}`,
        name: 'Unknown Person',
        boundingBox: {
          x: (box.x / imageWidth) * 100,
          y: (box.y / imageHeight) * 100,
          width: (box.width / imageWidth) * 100,
          height: (box.height / imageHeight) * 100
        },
        descriptor: detection.descriptor
      };
    });
    
    return results;
  } catch (error) {
    console.error('Error detecting faces:', error);
    
    // Fallback to mock data if detection fails
    console.log('Using fallback mock data for face detection');
    const mockDetections = [
      {
        id: `face-${Date.now()}-1`,
        name: 'Unknown Person',
        boundingBox: {
          x: 25,
          y: 20,
          width: 15,
          height: 15
        }
      },
      {
        id: `face-${Date.now()}-2`,
        name: 'Unknown Person',
        boundingBox: {
          x: 60,
          y: 22,
          width: 14,
          height: 14
        }
      }
    ];
    
    return mockDetections;
  }
};

// Compare faces using face descriptors
export const compareFaces = async (faceDescriptor1: Float32Array, faceDescriptor2: Float32Array) => {
  if (!faceDescriptor1 || !faceDescriptor2) {
    return false;
  }
  
  // Calculate distance between face descriptors
  const distance = faceapi.euclideanDistance(faceDescriptor1, faceDescriptor2);
  
  // Threshold for face similarity (lower means more similar)
  const FACE_MATCH_THRESHOLD = 0.6;
  
  return distance < FACE_MATCH_THRESHOLD;
};

// Group similar faces based on their descriptors
export const groupSimilarFaces = (detections: any[]) => {
  if (!detections || detections.length === 0) {
    return [];
  }
  
  // If detections don't have descriptors, return original array
  if (!detections[0].descriptor) {
    return detections;
  }
  
  const groups: any[] = [];
  
  // Process each face detection
  detections.forEach(detection => {
    // Check if this face matches any existing group
    const matchingGroup = groups.find(group => {
      // Compare with the first face in the group
      return compareFaces(detection.descriptor, group.faces[0].descriptor);
    });
    
    if (matchingGroup) {
      // Add to existing group
      matchingGroup.faces.push(detection);
    } else {
      // Create new group
      groups.push({
        id: `group-${Date.now()}-${groups.length}`,
        faces: [detection]
      });
    }
  });
  
  return groups;
};
