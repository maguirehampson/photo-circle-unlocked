
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PeopleTagView from "@/components/PeopleTagView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import PhotoDisplay from "@/components/photo-view/PhotoDisplay";
import PhotoDetails from "@/components/photo-view/PhotoDetails";
import CommentsSection from "@/components/photo-view/CommentsSection";
import { Person } from "@/components/photo-view/types";

// Mock photo data for our detailed view
const photoData = {
  id: "1",
  imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  description: "Dinner party at The Standard last night! 📸",
  username: "Saylor",
  userAvatar: "https://i.pravatar.cc/150?img=1",
  timestamp: "April 7, 2025",
  likes: 124,
  comments: [
    {
      id: "c1",
      username: "Mark",
      avatar: "https://i.pravatar.cc/150?img=3",
      text: "Great shots from last night!",
      timestamp: "2 hours ago"
    },
    {
      id: "c2",
      username: "alex_j",
      avatar: "https://i.pravatar.cc/150?img=4",
      text: "I need these photos ASAP!",
      timestamp: "1 hour ago"
    }
  ],
  taggedPeople: [
    {
      id: "p1",
      name: "Alex",
      facePosition: {
        x: 25,
        y: 20,
        width: 15,
        height: 15
      }
    },
    {
      id: "p2",
      name: "Jamie",
      facePosition: {
        x: 60,
        y: 22,
        width: 14,
        height: 14
      }
    },
    {
      id: "p3",
      name: "Sarah",
      facePosition: {
        x: 45,
        y: 60,
        width: 16,
        height: 16
      }
    }
  ]
};

const PhotoView = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [taggedPeople, setTaggedPeople] = useState(photoData.taggedPeople);
  
  // In a real app, we would fetch the photo data based on the id
  console.log(`Loading photo with id: ${id}`);
  
  const handlePersonClick = (person: Person) => {
    toast(`Selected: ${person.name}`);
  };
  
  const handlePeopleUpdate = (people: Person[]) => {
    setTaggedPeople(people);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Link to="/" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to feed
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PhotoDisplay 
            imageUrl={photoData.imageUrl}
            taggedPeople={taggedPeople}
            onPersonClick={handlePersonClick}
          />
          
          <div>
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="people" className="flex-1">People</TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <PhotoDetails
                  username={photoData.username}
                  userAvatar={photoData.userAvatar}
                  timestamp={photoData.timestamp}
                  description={photoData.description}
                  taggedPeople={taggedPeople}
                />
              </TabsContent>
              
              <TabsContent value="people">
                <PeopleTagView 
                  taggedPeople={taggedPeople}
                  imageUrl={photoData.imageUrl}
                  onPersonUpdate={handlePeopleUpdate}
                />
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentsSection comments={photoData.comments} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoView;
