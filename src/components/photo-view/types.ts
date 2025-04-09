export interface DeepFaceAnalysis {
  age: number;
  gender: {
    Woman: number;
    Man: number;
  };
  dominant_gender: string;
  emotion: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    sad: number;
    surprise: number;
    neutral: number;
  };
  dominant_emotion: string;
  race: {
    asian: number;
    indian: number;
    black: number;
    white: number;
    middle_eastern: number;
    latino_hispanic: number;
  };
  dominant_race: string;
}

export interface Person {
  id: string;
  name: string;
  facePosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
}
