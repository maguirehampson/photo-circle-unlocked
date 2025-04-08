
import React, { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const UploadButton: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
      
      setShowDialog(true);
    }
  };
  
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(intervalId);
        setIsUploading(false);
        setShowDialog(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setUploadProgress(0);
        
        toast.success(`${selectedFiles.length} photos uploaded successfully!`);
        
        // In a real app, we would process the photos with face detection here
        // For now, we'll just set a timeout to simulate processing
        setTimeout(() => {
          toast("Face detection complete", {
            description: `${Math.floor(Math.random() * 5) + 1} faces detected in your photos`,
          });
        }, 1500);
      }
    }, 100);
  };
  
  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setShowDialog(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadProgress(0);
    setIsUploading(false);
  };
  
  return (
    <>
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <Button onClick={handleOpenFileDialog} className="gap-2">
        <Upload className="h-4 w-4" />
        Upload Photos
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              {selectedFiles.length} photos selected for upload
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-4 max-h-60 overflow-y-auto">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Preview ${index}`} 
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadButton;
