
// Shared types for the photo view components
export interface Person {
  id: string;
  name: string;
  facePosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confirmed?: boolean;
  demographics?: {
    age?: number;
    gender?: string;
    emotion?: string;
    ethnicity?: string;
  };
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface PhotoData {
  id: string;
  imageUrl: string;
  description: string;
  username: string;
  userAvatar: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  taggedPeople: Person[];
}

export interface DeepFaceAnalysis {
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
