
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, User, UserPlus, Info } from "lucide-react";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Person {
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

interface PeopleTagViewProps {
  taggedPeople: Person[];
  imageUrl: string;
  onPersonUpdate?: (people: Person[]) => void;
}

const PeopleTagView: React.FC<PeopleTagViewProps> = ({ 
  taggedPeople, 
  imageUrl,
  onPersonUpdate
}) => {
  const [people, setPeople] = useState<Person[]>(taggedPeople);
  const [editMode, setEditMode] = useState(false);
  
  // Function to confirm a person's identity
  const handleConfirmPerson = (personId: string, confirmed: boolean) => {
    const updatedPeople = people.map(person => 
      person.id === personId ? { ...person, confirmed } : person
    );
    
    setPeople(updatedPeople);
    if (onPersonUpdate) {
      onPersonUpdate(updatedPeople);
    }
    
    toast.success(confirmed ? "Person confirmed" : "Person removed");
  };
  
  // Function to add a new person (in a real app, this would be used with face detection)
  const handleAddPerson = () => {
    toast.info("Select a face in the photo to tag a person");
    setEditMode(true);
  };
  
  // Function to simulate clicking on a face in the photo
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!editMode) return;
    
    // Get click coordinates relative to the image
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Add a new face
    const newPerson: Person = {
      id: `p${Date.now()}`,
      name: "New Person",
      facePosition: {
        x,
        y,
        width: 15,
        height: 15
      },
      demographics: {
        age: Math.floor(20 + Math.random() * 40),
        gender: Math.random() > 0.5 ? "Man" : "Woman",
        emotion: ["happy", "neutral", "sad"][Math.floor(Math.random() * 3)],
        ethnicity: ["asian", "white", "black", "latino hispanic"][Math.floor(Math.random() * 4)]
      }
    };
    
    setPeople([...people, newPerson]);
    setEditMode(false);
    toast.success("New person tagged");
    
    if (onPersonUpdate) {
      onPersonUpdate([...people, newPerson]);
    }
  };
  
  // Format demographic information for display
  const formatDemographics = (demographics?: Person["demographics"]) => {
    if (!demographics) return null;
    
    return (
      <div className="space-y-1">
        {demographics.age && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Age:</span>
            <span className="text-sm font-medium">{Math.round(demographics.age)} years</span>
          </div>
        )}
        {demographics.gender && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gender:</span>
            <span className="text-sm font-medium">{demographics.gender}</span>
          </div>
        )}
        {demographics.emotion && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Emotion:</span>
            <span className="text-sm font-medium capitalize">{demographics.emotion}</span>
          </div>
        )}
        {demographics.ethnicity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ethnicity:</span>
            <span className="text-sm font-medium capitalize">{demographics.ethnicity}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">People in this photo</h3>
        <Button onClick={handleAddPerson} variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Tag Person
        </Button>
      </div>
      
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Photo with tagged people" 
          className="w-full h-auto rounded-md"
          onClick={handleImageClick}
          style={{ cursor: editMode ? "crosshair" : "default" }}
        />
        
        {/* Face indicators */}
        {people.map((person) => (
          <div
            key={person.id}
            className="absolute border-2 border-white rounded-sm"
            style={{
              left: `${person.facePosition.x}%`,
              top: `${person.facePosition.y}%`,
              width: `${person.facePosition.width}%`,
              height: `${person.facePosition.height}%`,
              backgroundColor: "rgba(255, 255, 255, 0.2)"
            }}
          >
            <Badge 
              variant="secondary" 
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              {person.name}
            </Badge>
          </div>
        ))}
        
        {editMode && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
            <p className="text-white font-medium">Click on a face to tag</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Tagged People</h4>
        
        {people.length > 0 ? (
          <div className="space-y-2">
            {people.map((person) => (
              <div key={person.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{person.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{person.name}</span>
                  {person.confirmed && (
                    <Badge variant="outline" className="ml-2">Confirmed</Badge>
                  )}
                  
                  {person.demographics && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                          <Info className="h-3.5 w-3.5" />
                        </Button>
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
                
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-green-500"
                    onClick={() => handleConfirmPerson(person.id, true)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleConfirmPerson(person.id, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md">
            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No people tagged in this photo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleTagView;
