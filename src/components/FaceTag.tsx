
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FaceTagProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  onClick: () => void;
}

const FaceTag: React.FC<FaceTagProps> = ({ x, y, width, height, name, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="face-tag"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            onClick={onClick}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FaceTag;
