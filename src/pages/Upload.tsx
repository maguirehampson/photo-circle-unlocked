
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { loadModels } from "@/services/faceDetection";
import UploadInfoCard from "@/components/upload/UploadInfoCard";
import AboutDeepFaceCard from "@/components/upload/AboutDeepFaceCard";
import TestDeepFaceSection from "@/components/upload/TestDeepFaceSection";

const UploadPage = () => {
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
          <UploadInfoCard modelsStatus={modelsStatus} />
          <AboutDeepFaceCard modelsStatus={modelsStatus} />
        </div>
        
        <TestDeepFaceSection modelsStatus={modelsStatus} />
      </div>
    </div>
  );
};

export default UploadPage;
