
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadButton from "@/components/UploadButton";
import DeepFaceStatusAlert from "./DeepFaceStatusAlert";

interface UploadInfoCardProps {
  modelsStatus: 'loading' | 'loaded' | 'error';
}

const UploadInfoCard: React.FC<UploadInfoCardProps> = ({ modelsStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Photos with DeepFace AI</CardTitle>
        <CardDescription>
          Upload your photos and DeepFace AI will automatically detect and analyze faces
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DeepFaceStatusAlert status={modelsStatus} />
        
        <div className="pt-4">
          <UploadButton />
        </div>
        
        <div className="text-sm text-muted-foreground mt-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Upload your photos</li>
            <li>DeepFace AI automatically detects faces</li>
            <li>Review detected faces and confirm identities</li>
            <li>Get detailed demographic analysis including age, gender, emotion, and ethnicity</li>
            <li>Search and organize photos by person</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadInfoCard;
