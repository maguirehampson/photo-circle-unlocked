
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import PhotoView from "./pages/PhotoView";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import './App.css';
import FaceRecognitionTest from "./pages/FaceRecognitionTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/photo/:id" element={<PhotoView />} />
        <Route path="/profile/:id?" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/face-test" element={<FaceRecognitionTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
