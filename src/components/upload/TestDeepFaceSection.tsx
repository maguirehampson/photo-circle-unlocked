
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TestImageUploader from "./TestImageUploader";
import DetectionResults from "./DetectionResults";
import { Person } from "@/components/photo-view/types";
import { toast } from "sonner";
import { detectFaces } from "@/services/faceDetection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface TestDeepFaceSectionProps {
  modelsStatus: 'loading' | 'loaded' | 'error';
}

const TestDeepFaceSection: React.FC<TestDeepFaceSectionProps> = ({ modelsStatus }) => {
  const [testImage, setTestImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<Person[]>([]);

  const handleImageUpload = (image: string) => {
    setTestImage(image);
    setDetectedFaces([]);
  };
  
  const handleRunDetection = async () => {
    if (!testImage) return;
    
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = testImage;
      
      // Wait for image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Run face detection
      const faces = await detectFaces(img);
      setDetectedFaces(faces);
      
      toast.success(`Detection complete: ${faces.length} faces found`);
    } catch (error) {
      console.error("Error processing test image:", error);
      toast.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Test DeepFace AI</h2>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          <p>For optimal face detection accuracy:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Use well-lit photos with clear, forward-facing subjects</li>
            <li>Ensure faces are not obscured or at extreme angles</li>
            <li>Quality may vary with group photos or challenging lighting</li>
            <li>Check confidence scores to understand prediction reliability</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Try Face Detection</CardTitle>
          <CardDescription>
            Upload a test image to see DeepFace AI in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestImageUploader 
              testImage={testImage}
              isProcessing={isProcessing}
              modelsStatus={modelsStatus}
              detectedFaces={detectedFaces}
              onImageUpload={handleImageUpload}
              onRunDetection={handleRunDetection}
            />
            
            <DetectionResults detectedFaces={detectedFaces} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDeepFaceSection;
