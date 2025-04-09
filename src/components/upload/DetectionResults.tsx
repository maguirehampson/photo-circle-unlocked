
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Person } from "@/components/photo-view/types";
import { Progress } from "@/components/ui/progress";

interface DetectionResultsProps {
  detectedFaces: Person[];
}

const DetectionResults: React.FC<DetectionResultsProps> = ({ detectedFaces }) => {
  // Function to format confidence as percentage
  const formatConfidence = (confidence?: number): string => {
    if (confidence === undefined) return "Unknown";
    return `${Math.round(confidence * 100)}%`;
  };
  
  return (
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
                <div className="space-y-3 text-sm">
                  {face.demographics.age && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span className="font-medium">{Math.round(face.demographics.age)} years</span>
                      </div>
                    </div>
                  )}
                  
                  {face.demographics.gender && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="font-medium">{face.demographics.gender}</span>
                      </div>
                      {face.demographics.confidence?.gender !== undefined && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Confidence</span>
                            <span>{formatConfidence(face.demographics.confidence.gender)}</span>
                          </div>
                          <Progress value={face.demographics.confidence.gender * 100} className="h-1" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {face.demographics.emotion && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emotion:</span>
                        <span className="font-medium capitalize">{face.demographics.emotion}</span>
                      </div>
                      {face.demographics.confidence?.emotion !== undefined && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Confidence</span>
                            <span>{formatConfidence(face.demographics.confidence.emotion)}</span>
                          </div>
                          <Progress value={face.demographics.confidence.emotion * 100} className="h-1" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {face.demographics.ethnicity && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ethnicity:</span>
                        <span className="font-medium capitalize">{face.demographics.ethnicity}</span>
                      </div>
                      {face.demographics.confidence?.ethnicity !== undefined && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Confidence</span>
                            <span>{formatConfidence(face.demographics.confidence.ethnicity)}</span>
                          </div>
                          <Progress value={face.demographics.confidence.ethnicity * 100} className="h-1" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground bg-background p-2 rounded">
                    <p>Note: Lower confidence scores indicate less reliable predictions.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionResults;
