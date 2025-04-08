import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PhotoGrid from "@/components/PhotoGrid";
import UploadButton from "@/components/UploadButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Photo } from "@/components/PhotoGrid";
import { toast } from "sonner";

const mockPhotos: Photo[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    username: "Saylor",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    likes: 124,
    comments: 12,
    taggedPeople: 5,
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1501238295340-c810d3c156d2",
    username: "Jamie",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    likes: 89,
    comments: 4,
    taggedPeople: 3,
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    username: "Saylor",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    likes: 56,
    comments: 8,
    taggedPeople: 4,
    timestamp: "Yesterday"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1516939884455-1445c8652f83",
    username: "Mark",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    likes: 203,
    comments: 22,
    taggedPeople: 6,
    timestamp: "2 days ago"
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1524638431109-93d95c968f03",
    username: "Sarah",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    likes: 134,
    comments: 16,
    taggedPeople: 7,
    timestamp: "3 days ago"
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    username: "Saylor",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    likes: 78,
    comments: 9,
    taggedPeople: 2,
    timestamp: "1 week ago"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    // Simulate notifications
    setTimeout(() => {
      toast("New photos from Saylor", {
        description: "12 new photos have been uploaded",
      });
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">PhotoShare</h1>
          <UploadButton />
        </div>

        <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="tagged">Tagged</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
          <TabsContent value="feed" className="mt-0">
            <PhotoGrid photos={mockPhotos} />
          </TabsContent>
          <TabsContent value="tagged" className="mt-0">
            <PhotoGrid photos={mockPhotos.filter((photo) => photo.username === "Saylor")} />
          </TabsContent>
          <TabsContent value="discover" className="mt-0">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Discover features coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
