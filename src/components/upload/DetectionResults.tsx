
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Person } from "@/components/photo-view/types";

interface DetectionResultsProps {
  detectedFaces: Person[];
}

const DetectionResults: React.FC<DetectionResultsProps> = ({ detectedFaces }) => {
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
  );
};

export default DetectionResults;
