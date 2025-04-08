
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
