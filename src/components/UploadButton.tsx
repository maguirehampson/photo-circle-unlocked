
import React, { useState, useRef, useEffect } from "react";
import { Upload, Loader2, ScanFace } from "lucide-react";
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
import { loadModels, detectFaces } from "@/services/faceDetection";

const UploadButton: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isProcessingFaces, setIsProcessingFaces] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load face detection models when component mounts
  useEffect(() => {
    const initializeFaceDetection = async () => {
      const loaded = await loadModels();
      setModelsLoaded(loaded);
      
      if (loaded) {
        console.log("Face detection models loaded successfully");
      } else {
        console.error("Failed to load face detection models");
        toast.error("Face detection models could not be loaded", {
          description: "Some features may not work correctly"
        });
      }
    };
    
    initializeFaceDetection();
  }, []);
  
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
  
  const processImagesForFaces = async (files: File[]) => {
    setIsProcessingFaces(true);
    
    try {
      let totalFacesDetected = 0;
      
      // Process each image for face detection
      for (const file of files) {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;
        
        // Wait for image to load
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        // Run face detection
        const detectedFaces = await detectFaces(img);
        totalFacesDetected += detectedFaces.length;
        
        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);
      }
      
      return totalFacesDetected;
    } catch (error) {
      console.error("Error processing faces:", error);
      return 0;
    } finally {
      setIsProcessingFaces(false);
    }
  };
  
  const handleUpload = async () => {
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
        
        // Process face detection after upload completes
        processImagesForFaces(selectedFiles).then(facesCount => {
          toast.success(`${selectedFiles.length} photos uploaded successfully!`);
          
          // Show face detection results
          if (facesCount > 0) {
            toast("Face detection complete", {
              description: `${facesCount} faces detected in your photos`,
              icon: <ScanFace className="h-4 w-4" />
            });
          } else {
            toast("No faces detected", {
              description: "Try uploading photos with clearer faces"
            });
          }
          
          // Reset state
          setSelectedFiles([]);
          setPreviewUrls([]);
          setUploadProgress(0);
        });
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
      
      <Button 
        onClick={handleOpenFileDialog} 
        className="gap-2"
        disabled={!modelsLoaded && selectedFiles.length === 0}
      >
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
              disabled={isUploading || selectedFiles.length === 0 || !modelsLoaded}
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
