
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  const [commentText, setCommentText] = useState("");
  
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      toast.success("Comment added");
      setCommentText("");
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {comments.map((comment) => (
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
    </Card>
  );
};

export default CommentsSection;
