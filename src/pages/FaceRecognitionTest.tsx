
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, Scan, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  processImage, 
  FaceRecognitionResult, 
  enhanceFaceRecognitionResults 
} from "@/services/faceRecognitionService";

const FaceRecognitionTest = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<FaceRecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setResults(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsProcessing(true);

    try {
      const apiResults = await processImage(selectedFile);
      const enhancedResults = enhanceFaceRecognitionResults(apiResults);
      setResults(enhancedResults);
      setApiReachable(true);
      toast.success(`Detected ${enhancedResults.faces_detected} faces`);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Is the API server running?");
      setApiReachable(false);
      
      // Fallback to mock results for demonstration
      const mockResults: FaceRecognitionResult = {
        faces_detected: 2,
        face_details: Array.from({ length: 2 }, (_, i) => ({
          person_id: `Person_${i + 1}`,
          confidence: Math.random() * 0.4 + 0.6,
          quality_metrics: {
            brightness: Math.random() * 0.8 + 0.2,
            sharpness: Math.random() * 0.8 + 0.1,
            contrast: Math.random() * 0.7 + 0.3
          },
          location: {
            top: 50,
            right: 200,
            bottom: 200,
            left: 50,
            width: 150,
            height: 150
          }
        }))
      };
      
      setResults(mockResults);
      toast.info("Using mock data for demonstration");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Face Recognition Testing</h1>

        <Alert variant="default" className="bg-blue-50 border-blue-200 mb-6">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <p>This interface connects to your Python face recognition API. Upload a photo to test face detection.</p>
            <p className="mt-1">For best results, use clear, well-lit photos with forward-facing subjects.</p>
            {apiReachable === false && (
              <p className="mt-1 font-medium text-red-600">
                API connection failed. Using mock data. Make sure your API is running on http://localhost:8000
              </p>
            )}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Test Image</CardTitle>
              <CardDescription>
                Select an image to analyze with face recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="h-full object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                    </>
                  )}
                </label>
              </div>

              <Button 
                onClick={handleProcessImage} 
                disabled={!selectedImage || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recognition Results</CardTitle>
              <CardDescription>
                Face detection and quality analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="space-y-4 p-4">
                  <p className="text-center text-sm text-gray-500 mb-2">Processing image...</p>
                  <Progress value={50} className="w-full" />
                </div>
              ) : results ? (
                <div className="space-y-4">
                  <p className="font-medium">Detected {results.faces_detected} faces</p>
                  
                  {results.visualization && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Visualization:</p>
                      <img 
                        src={`data:image/jpeg;base64,${results.visualization}`} 
                        alt="Visualization" 
                        className="w-full rounded-lg border" 
                      />
                    </div>
                  )}
                  
                  {results.face_details.map((face, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{face.person_id}</span>
                        <span>Confidence: {formatPercentage(face.confidence)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Quality Metrics:</p>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Brightness</span>
                            <span>{formatPercentage(face.quality_metrics.brightness)}</span>
                          </div>
                          <Progress value={face.quality_metrics.brightness * 100} className="h-2 mt-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Sharpness</span>
                            <span>{formatPercentage(face.quality_metrics.sharpness)}</span>
                          </div>
                          <Progress value={face.quality_metrics.sharpness * 100} className="h-2 mt-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Contrast</span>
                            <span>{formatPercentage(face.quality_metrics.contrast)}</span>
                          </div>
                          <Progress value={face.quality_metrics.contrast * 100} className="h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-gray-500">Upload and analyze an image to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">API Connection Guide</h2>
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">To connect this interface with your Python face recognition API:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Start your Python API with <code className="bg-gray-100 px-2 py-1 rounded">uvicorn api.face_recognition_api:app --reload</code></li>
                <li>Make sure the API is running at <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code></li>
                <li>Ensure CORS is enabled on your API to allow requests from this domain</li>
                <li>If you're having connection issues, check that your browser allows cross-origin requests</li>
              </ol>
              <p className="mt-4 text-sm text-gray-500">
                {apiReachable === false ? 
                  "Currently using mock data because API couldn't be reached." : 
                  apiReachable === true ? 
                    "Successfully connected to the API." : 
                    "Connection status will be shown after you process an image."
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionTest;
