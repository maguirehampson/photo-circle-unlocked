
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Photo } from "@/components/PhotoGrid";
import PhotoGrid from "@/components/PhotoGrid";
import { Settings, LogOut } from "lucide-react";

// Mock user data
const user = {
  name: "Alex Johnson",
  username: "alex_j",
  avatar: "https://i.pravatar.cc/150?img=4",
  bio: "Photography enthusiast | Digital camera collector | Loves capturing moments",
  stats: {
    uploads: 24,
    following: 156,
    followers: 238
  }
};

// Mock photos same as in Index.tsx but filtered for this user
const mockPhotos: Photo[] = [
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
    username: "alex_j",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    likes: 87,
    comments: 14,
    taggedPeople: 3,
    timestamp: "1 week ago"
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1559923323-caf0869760c9",
    username: "alex_j",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    likes: 65,
    comments: 7,
    taggedPeople: 2,
    timestamp: "2 weeks ago"
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3",
    username: "alex_j",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    likes: 112,
    comments: 23,
    taggedPeople: 5,
    timestamp: "3 weeks ago"
  }
];

// Photos where the user is tagged
const taggedPhotos: Photo[] = [
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
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    username: "Saylor",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    likes: 56,
    comments: 8,
    taggedPeople: 4,
    timestamp: "Yesterday"
  }
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
            
            <p className="mb-4">{user.bio}</p>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className="font-bold">{user.stats.uploads}</p>
                <p className="text-sm text-muted-foreground">Uploads</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{user.stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="photos">My Photos</TabsTrigger>
            <TabsTrigger value="tagged">Tagged In</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="mt-0">
            <PhotoGrid photos={mockPhotos} />
          </TabsContent>
          
          <TabsContent value="tagged" className="mt-0">
            <PhotoGrid photos={taggedPhotos} />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            <div className="text-center py-16">
              <p className="text-muted-foreground">You haven't saved any photos yet.</p>
              <Link to="/">
                <Button variant="link" className="mt-2">Browse photos</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
