
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import UploadButton from "@/components/UploadButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanFace, AlertTriangle, Upload } from "lucide-react";
import { loadModels, detectFaces } from "@/services/faceDetection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Person } from "@/components/photo-view/types";

const Upload = () => {
  const [modelsStatus, setModelsStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [testImage, setTestImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<Person[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleTestImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTestImage(event.target?.result as string);
        setDetectedFaces([]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTestImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
        
        {/* Test Area for DeepFace */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Test DeepFace AI</h2>
          <Card>
            <CardHeader>
              <CardTitle>Try Face Detection</CardTitle>
              <CardDescription>
                Upload a test image to see DeepFace AI in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
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
                      onClick={handleRunDetection}
                      disabled={!testImage || isProcessing || modelsStatus !== 'loaded'}
                    >
                      {isProcessing ? "Processing..." : "Run Face Detection"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Detection Results:</h3>
                  {detectedFaces.length === 0 ? (
                    <p className="text-sm text-gray-500">No faces detected yet. Upload an image and run detection.</p>
                  ) : (
                    <div className="space-y-4">
                      {detectedFaces.map((face, index) => (
                        <div key={face.id} className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium">Face #{index+1}</h4>
                          <Separator className="my-2" />
                          {face.demographics && (
                            <div className="space-y-1 text-sm">
                              {face.demographics.age && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Age:</span>
                                  <span className="font-medium">{Math.round(face.demographics.age)} years</span>
                                </div>
                              )}
                              {face.demographics.gender && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gender:</span>
                                  <span className="font-medium">{face.demographics.gender}</span>
                                </div>
                              )}
                              {face.demographics.emotion && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Emotion:</span>
                                  <span className="font-medium capitalize">{face.demographics.emotion}</span>
                                </div>
                              )}
                              {face.demographics.ethnicity && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Ethnicity:</span>
                                  <span className="font-medium capitalize">{face.demographics.ethnicity}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
