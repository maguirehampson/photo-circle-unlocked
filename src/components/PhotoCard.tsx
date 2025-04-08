
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, User } from "lucide-react";

interface PhotoCardProps {
  id: string;
  imageUrl: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  taggedPeople: number;
  timestamp: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  id,
  imageUrl,
  username,
  userAvatar,
  likes,
  comments,
  taggedPeople,
  timestamp,
}) => {
  return (
    <Card className="photo-card overflow-hidden">
      <Link to={`/photo/${id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={`Photo by ${username}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            <User className="inline h-3 w-3 mr-1" />
            {taggedPeople}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userAvatar} alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{username}</span>
          </div>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Heart className="h-4 w-4 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
