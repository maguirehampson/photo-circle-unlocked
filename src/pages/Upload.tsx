
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import UploadButton from "@/components/UploadButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanFace, AlertTriangle } from "lucide-react";
import { loadModels } from "@/services/faceDetection";

const Upload = () => {
  const [modelsStatus, setModelsStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  useEffect(() => {
    const checkModels = async () => {
      try {
        setModelsStatus('loading');
        const loaded = await loadModels();
        
        if (loaded) {
          setModelsStatus('loaded');
        } else {
          setModelsStatus('error');
        }
      } catch (error) {
        console.error("Error checking face models:", error);
        setModelsStatus('error');
      }
    };
    
    checkModels();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Upload Photos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Photos with DeepFace AI</CardTitle>
              <CardDescription>
                Upload your photos and DeepFace AI will automatically detect and analyze faces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modelsStatus === 'loading' && (
                <Alert>
                  <ScanFace className="h-4 w-4" />
                  <AlertTitle>Loading DeepFace AI</AlertTitle>
                  <AlertDescription>
                    Please wait while we initialize the DeepFace AI...
                  </AlertDescription>
                </Alert>
              )}
              
              {modelsStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>DeepFace AI Unavailable</AlertTitle>
                  <AlertDescription>
                    Could not initialize DeepFace AI. Some features may be limited.
                  </AlertDescription>
                </Alert>
              )}
              
              {modelsStatus === 'loaded' && (
                <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                  <ScanFace className="h-4 w-4" />
                  <AlertTitle>DeepFace AI Ready</AlertTitle>
                  <AlertDescription>
                    DeepFace AI has been initialized successfully
                  </AlertDescription>
                </Alert>
              )}
              
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
        </div>
      </div>
    </div>
  );
};

export default Upload;
