
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanFace, AlertTriangle } from "lucide-react";

interface DeepFaceStatusAlertProps {
  status: 'loading' | 'loaded' | 'error';
}

const DeepFaceStatusAlert: React.FC<DeepFaceStatusAlertProps> = ({ status }) => {
  if (status === 'loading') {
    return (
      <Alert>
        <ScanFace className="h-4 w-4" />
        <AlertTitle>Loading DeepFace AI</AlertTitle>
        <AlertDescription>
          Please wait while we initialize the DeepFace AI...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>DeepFace AI Unavailable</AlertTitle>
        <AlertDescription>
          Could not initialize DeepFace AI. Some features may be limited.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
      <ScanFace className="h-4 w-4" />
      <AlertTitle>DeepFace AI Ready</AlertTitle>
      <AlertDescription>
        DeepFace AI has been initialized successfully
      </AlertDescription>
    </Alert>
  );
};

export default DeepFaceStatusAlert;
