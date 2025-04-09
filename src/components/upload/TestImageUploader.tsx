
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Person } from "@/components/photo-view/types";

interface TestImageUploaderProps {
  testImage: string | null;
  isProcessing: boolean;
  modelsStatus: 'loading' | 'loaded' | 'error';
  detectedFaces: Person[];
  onImageUpload: (image: string) => void;
  onRunDetection: () => void;
}

const TestImageUploader: React.FC<TestImageUploaderProps> = ({
  testImage,
  isProcessing,
  modelsStatus,
  detectedFaces,
  onImageUpload,
  onRunDetection
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTestImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleTestImageUpload}
      />
      
      {!testImage ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={handleTestImageClick}
        >
          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload a test image</p>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={testImage} 
            alt="Test" 
            className="w-full h-auto rounded-lg"
          />
          {detectedFaces.map((face) => (
            <div
              key={face.id}
              className="absolute border-2 border-green-500"
              style={{
                left: `${face.facePosition.x}%`,
                top: `${face.facePosition.y}%`,
                width: `${face.facePosition.width}%`,
                height: `${face.facePosition.height}%`,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          onClick={handleTestImageClick}
          variant="outline"
        >
          {testImage ? "Change Image" : "Upload Image"}
        </Button>
        
        <Button 
          onClick={onRunDetection}
          disabled={!testImage || isProcessing || modelsStatus !== 'loaded'}
        >
          {isProcessing ? "Processing..." : "Run Face Detection"}
        </Button>
      </div>
    </div>
  );
};

export default TestImageUploader;
