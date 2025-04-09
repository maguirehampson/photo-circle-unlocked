
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutDeepFaceCardProps {
  modelsStatus: 'loading' | 'loaded' | 'error';
}

const AboutDeepFaceCard: React.FC<AboutDeepFaceCardProps> = ({ modelsStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About DeepFace AI</CardTitle>
        <CardDescription>
          Advanced facial analysis capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">DeepFace AI Features</h3>
          <p className="text-sm mb-4">
            DeepFace is a state-of-the-art facial analysis framework with the following capabilities:
          </p>
          
          <h4 className="font-medium text-sm mb-2">Key Features:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>High-accuracy face detection</li>
            <li>Age estimation</li>
            <li>Gender classification</li>
            <li>Emotion recognition (happy, sad, angry, etc.)</li>
            <li>Ethnicity analysis</li>
            <li>Face recognition and verification</li>
          </ul>
        </div>
        
        {modelsStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <h3 className="font-medium text-red-800 mb-2">Troubleshooting</h3>
            <p className="text-sm text-red-700">
              If DeepFace AI fails to initialize, try refreshing the page. Some features may still work with mock data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AboutDeepFaceCard;
