
import React, { useState } from "react";
import FaceTag from "@/components/FaceTag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Person {
  id: string;
  name: string;
  facePosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PhotoDisplayProps {
  imageUrl: string;
  taggedPeople: Person[];
  onPersonClick: (person: Person) => void;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({
  imageUrl,
  taggedPeople,
  onPersonClick,
}) => {
  const [showFaceTags, setShowFaceTags] = useState(true);
  const [liked, setLiked] = useState(false);
  
  const handleDownload = () => {
    toast.success("Photo saved to your library");
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };
  
  const handleShare = () => {
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="lg:col-span-2">
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt="Photo"
            className="w-full h-auto"
          />
          {showFaceTags && taggedPeople.map((person) => (
            <FaceTag
              key={person.id}
              x={person.facePosition.x}
              y={person.facePosition.y}
              width={person.facePosition.width}
              height={person.facePosition.height}
              name={person.name}
              onClick={() => onPersonClick(person)}
            />
          ))}
        </div>
      </Card>
      
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowFaceTags(!showFaceTags)}>
          {showFaceTags ? "Hide" : "Show"} Face Tags
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" /> Save
        </Button>
        <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleLike}>
          <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} /> 
          {liked ? "Liked" : "Like"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
      </div>
    </div>
  );
};

export default PhotoDisplay;
