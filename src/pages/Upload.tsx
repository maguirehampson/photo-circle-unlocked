
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
              <CardTitle>Upload Photos with Face Detection</CardTitle>
              <CardDescription>
                Upload your photos and our AI will automatically detect faces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modelsStatus === 'loading' && (
                <Alert>
                  <ScanFace className="h-4 w-4" />
                  <AlertTitle>Loading Face Detection</AlertTitle>
                  <AlertDescription>
                    Please wait while we load the face detection models...
                  </AlertDescription>
                </Alert>
              )}
              
              {modelsStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Face Detection Unavailable</AlertTitle>
                  <AlertDescription>
                    Could not load face detection models. Make sure you have the model files in your public/models directory.
                  </AlertDescription>
                </Alert>
              )}
              
              {modelsStatus === 'loaded' && (
                <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                  <ScanFace className="h-4 w-4" />
                  <AlertTitle>Face Detection Ready</AlertTitle>
                  <AlertDescription>
                    Face detection models have been loaded successfully
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
                  <li>Our AI automatically detects faces</li>
                  <li>Review detected faces and confirm identities</li>
                  <li>Search and organize photos by person</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                How to set up face detection models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Required Model Files</h3>
                <p className="text-sm mb-4">
                  For face detection to work, you need to download the face-api.js models and place them in the <code>public/models</code> directory.
                </p>
                
                <h4 className="font-medium text-sm mb-2">Download Models:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Download the models from the <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">face-api.js GitHub repository</a></li>
                  <li>Create a <code>models</code> folder inside your project's <code>public</code> directory</li>
                  <li>Copy all model files into the <code>public/models</code> directory</li>
                  <li>Required models:
                    <ul className="list-disc pl-5 mt-1">
                      <li>ssd_mobilenetv1_model-weights_manifest.json</li>
                      <li>face_landmark_68_model-weights_manifest.json</li>
                      <li>face_recognition_model-weights_manifest.json</li>
                      <li>And their associated binary files</li>
                    </ul>
                  </li>
                </ol>
              </div>
              
              {modelsStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <h3 className="font-medium text-red-800 mb-2">Troubleshooting</h3>
                  <p className="text-sm text-red-700">
                    If face detection fails to load, check your browser console for specific errors and ensure all model files are correctly placed.
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
