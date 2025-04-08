
import React from "react";
import PhotoCard from "./PhotoCard";

export interface Photo {
  id: string;
  imageUrl: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  taggedPeople: number;
  timestamp: string;
}

interface PhotoGridProps {
  photos: Photo[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  return (
    <div className="photo-grid w-full py-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} {...photo} />
      ))}
    </div>
  );
};

export default PhotoGrid;
