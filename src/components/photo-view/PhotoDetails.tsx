
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Person } from "./types";
import { Info } from "lucide-react";

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
  // Format demographic information for display
  const formatDemographics = (demographics?: Person["demographics"]) => {
    if (!demographics) return null;
    
    return (
      <div className="space-y-1 text-sm">
        {demographics.age && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Age:</span>
            <span className="font-medium">{Math.round(demographics.age)} years</span>
          </div>
        )}
        {demographics.gender && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Gender:</span>
            <span className="font-medium">{demographics.gender}</span>
          </div>
        )}
        {demographics.emotion && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Emotion:</span>
            <span className="font-medium capitalize">{demographics.emotion}</span>
          </div>
        )}
        {demographics.ethnicity && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ethnicity:</span>
            <span className="font-medium capitalize">{demographics.ethnicity}</span>
          </div>
        )}
      </div>
    );
  };

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
            <div key={person.id} className="inline-flex items-center">
              <Badge variant="secondary" className="mr-1">{person.name}</Badge>
              
              {person.demographics && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-56">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Demographics</h5>
                      {formatDemographics(person.demographics)}
                      <div className="text-xs text-muted-foreground pt-2">
                        <em>Powered by DeepFace AI</em>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PhotoDetails;
