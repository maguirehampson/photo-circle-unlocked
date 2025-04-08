
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, User, UserX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Photo } from "@/components/PhotoGrid";
import PhotoCard from "@/components/PhotoCard";

interface PhotoOrganizerProps {
  photos: Photo[];
}

interface Person {
  id: string;
  name: string;
  avatarUrl?: string;
}

const PhotoOrganizer: React.FC<PhotoOrganizerProps> = ({ photos }) => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  
  // Mock people data (in a real app, this would come from face detection)
  const people: Person[] = [
    { id: "1", name: "Alex", avatarUrl: "https://i.pravatar.cc/150?img=4" },
    { id: "2", name: "Saylor", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    { id: "3", name: "Jamie", avatarUrl: "https://i.pravatar.cc/150?img=2" },
    { id: "4", name: "Mark", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    { id: "5", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?img=5" }
  ];
  
  // Filter photos by selected person
  // In a real app, this would use face detection results
  const filteredPhotos = selectedPerson 
    ? photos.filter(photo => {
        if (selectedPerson === "1") return photo.username === "alex_j";
        if (selectedPerson === "2") return photo.username === "Saylor";
        if (selectedPerson === "3") return photo.username === "Jamie";
        if (selectedPerson === "4") return photo.username === "Mark";
        if (selectedPerson === "5") return photo.username === "Sarah";
        return false;
      })
    : photos;
  
  const handlePersonSelect = (personId: string) => {
    setSelectedPerson(prevSelected => prevSelected === personId ? null : personId);
  };
  
  const handleBulkSave = () => {
    if (selectedPerson && filteredPhotos.length > 0) {
      toast.success(`${filteredPhotos.length} photos saved to your collection!`);
    } else {
      toast.error("Please select a person and at least one photo");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organize by Person</h2>
        <Button 
          onClick={handleBulkSave}
          disabled={!selectedPerson || filteredPhotos.length === 0}
          variant="default"
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Save All to Your Collection
        </Button>
      </div>
      
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {people.map(person => (
          <button
            key={person.id}
            onClick={() => handlePersonSelect(person.id)}
            className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] ${
              selectedPerson === person.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Avatar className="h-12 w-12 mb-1">
              {person.avatarUrl ? (
                <img src={person.avatarUrl} alt={person.name} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">{person.name}</span>
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.length > 0 ? (
          filteredPhotos.map(photo => (
            <PhotoCard key={photo.id} {...photo} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-medium text-lg">No photos found</h3>
            <p className="text-muted-foreground">
              {selectedPerson 
                ? "No photos with this person were detected" 
                : "Select a person to see their photos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoOrganizer;
