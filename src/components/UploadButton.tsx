
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UploadButton: React.FC = () => {
  const handleUpload = () => {
    // Simulate upload success
    setTimeout(() => {
      toast.success("Photos uploaded successfully!");
    }, 1500);
  };

  return (
    <Button onClick={handleUpload} className="gap-2">
      <Upload className="h-4 w-4" />
      Upload Photos
    </Button>
  );
};

export default UploadButton;
