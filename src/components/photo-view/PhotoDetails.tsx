
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

interface PhotoDetailsProps {
  username: string;
  userAvatar: string;
  timestamp: string;
  description: string;
  taggedPeople: Person[];
}

const PhotoDetails: React.FC<PhotoDetailsProps> = ({
  username,
  userAvatar,
  timestamp,
  description,
  taggedPeople,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{username}</p>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </div>
      
      <p className="mb-4">{description}</p>
      
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Tagged People:</p>
        <div className="flex flex-wrap gap-2">
          {taggedPeople.map((person) => (
            <Badge key={person.id} variant="secondary">{person.name}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PhotoDetails;
