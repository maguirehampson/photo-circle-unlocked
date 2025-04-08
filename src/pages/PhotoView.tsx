
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FaceTag from "@/components/FaceTag";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Heart, MessageCircle, Share2, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

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
  const [showFaceTags, setShowFaceTags] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // In a real app, we would fetch the photo data based on the id
  console.log(`Loading photo with id: ${id}`);
  
  const handlePersonClick = (person: Person) => {
    toast(`Selected: ${person.name}`);
  };
  
  const handleDownload = () => {
    toast.success("Photo saved to your library");
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };
  
  const handleShare = () => {
    toast.success("Share link copied to clipboard");
  };
  
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      toast.success("Comment added");
      setCommentText("");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Link to="/" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to feed
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={photoData.imageUrl}
                  alt={`Photo by ${photoData.username}`}
                  className="w-full h-auto"
                />
                {showFaceTags && photoData.taggedPeople.map((person) => (
                  <FaceTag
                    key={person.id}
                    x={person.facePosition.x}
                    y={person.facePosition.y}
                    width={person.facePosition.width}
                    height={person.facePosition.height}
                    name={person.name}
                    onClick={() => handlePersonClick(person)}
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
          
          <div>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={photoData.userAvatar} alt={photoData.username} />
                    <AvatarFallback>{photoData.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{photoData.username}</p>
                    <p className="text-xs text-muted-foreground">{photoData.timestamp}</p>
                  </div>
                </div>
              </div>
              
              <p className="mb-4">{photoData.description}</p>
              
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Tagged People:</p>
                <div className="flex flex-wrap gap-2">
                  {photoData.taggedPeople.map((person) => (
                    <Badge key={person.id} variant="secondary">{person.name}</Badge>
                  ))}
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="you" className="flex-1">You</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {photoData.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar} alt={comment.username} />
                          <AvatarFallback>{comment.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="bg-secondary p-3 rounded-lg">
                            <p className="font-medium text-sm">{comment.username}</p>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="you">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Only showing comments that mention you</p>
                  </div>
                </TabsContent>
                
                <form onSubmit={handleSendComment} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button type="submit" disabled={!commentText.trim()}>Send</Button>
                </form>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoView;
