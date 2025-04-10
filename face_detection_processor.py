import cv2
import numpy as np
from typing import List, Tuple, Dict, Any
import logging
from deepface import DeepFace
from deepface.commons import functions

class FaceDetectionProcessor:
    def __init__(self, detection_backend: str = "opencv"):
        self.detection_backend = detection_backend
        self.logger = self._setup_logger()
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
    def _setup_logger(self):
        logger = logging.getLogger('FaceDetection')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better face detection"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Apply histogram equalization
        gray = cv2.equalizeHist(gray)
        
        # Apply adaptive thresholding
        gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)
        
        # Apply bilateral filter for noise reduction while preserving edges
        gray = cv2.bilateralFilter(gray, 9, 75, 75)
        
        # Convert back to RGB
        return cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

    def detect_faces(self, image: np.ndarray) -> List[Dict[str, Any]]:
        """Detect faces using multiple methods and combine results"""
        processed_image = self.preprocess_image(image)
        
        # Initialize results
        all_faces = []
        
        # Method 1: Haar Cascade
        try:
            faces_haar = self.face_cascade.detectMultiScale(
                processed_image,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            for (x, y, w, h) in faces_haar:
                all_faces.append({
                    'x': x,
                    'y': y,
                    'w': w,
                    'h': h,
                    'confidence': 1.0,
                    'method': 'haar'
                })
        except Exception as e:
            self.logger.warning(f"Error in Haar cascade detection: {str(e)}")
        
        # Method 2: DeepFace
        try:
            faces_deepface = DeepFace.extract_faces(
                img_path=image,
                target_size=(224, 224),
                detector_backend=self.detection_backend,
                enforce_detection=False
            )
            for face in faces_deepface:
                all_faces.append({
                    'x': face['facial_area']['x'],
                    'y': face['facial_area']['y'],
                    'w': face['facial_area']['w'],
                    'h': face['facial_area']['h'],
                    'confidence': face['confidence'],
                    'method': 'deepface'
                })
        except Exception as e:
            self.logger.warning(f"Error in DeepFace detection: {str(e)}")
        
        # Remove duplicate detections
        unique_faces = self._remove_duplicates(all_faces)
        
        return unique_faces

    def _remove_duplicates(self, faces: List[Dict[str, Any]], iou_threshold: float = 0.3) -> List[Dict[str, Any]]:
        """Remove duplicate face detections using IoU"""
        if not faces:
            return []
        
        # Sort faces by confidence
        faces.sort(key=lambda x: x['confidence'], reverse=True)
        
        unique_faces = []
        used_indices = set()
        
        for i, face1 in enumerate(faces):
            if i in used_indices:
                continue
                
            unique_faces.append(face1)
            used_indices.add(i)
            
            for j, face2 in enumerate(faces[i+1:], start=i+1):
                if j in used_indices:
                    continue
                    
                iou = self._calculate_iou(face1, face2)
                if iou > iou_threshold:
                    used_indices.add(j)
        
        return unique_faces

    def _calculate_iou(self, face1: Dict[str, Any], face2: Dict[str, Any]) -> float:
        """Calculate Intersection over Union for two face detections"""
        x1 = max(face1['x'], face2['x'])
        y1 = max(face1['y'], face2['y'])
        x2 = min(face1['x'] + face1['w'], face2['x'] + face2['w'])
        y2 = min(face1['y'] + face1['h'], face2['y'] + face2['h'])
        
        if x2 < x1 or y2 < y1:
            return 0.0
            
        intersection_area = (x2 - x1) * (y2 - y1)
        face1_area = face1['w'] * face1['h']
        face2_area = face2['w'] * face2['h']
        
        return intersection_area / float(face1_area + face2_area - intersection_area)

    def align_face(self, image: np.ndarray, face: Dict[str, Any]) -> np.ndarray:
        """Align face using facial landmarks"""
        try:
            # Extract face region
            x, y, w, h = face['x'], face['y'], face['w'], face['h']
            face_img = image[y:y+h, x:x+w]
            
            # Get facial landmarks
            landmarks = DeepFace.extract_faces(
                img_path=face_img,
                target_size=(224, 224),
                detector_backend=self.detection_backend,
                enforce_detection=False
            )
            
            if not landmarks:
                return face_img
                
            # Get eye positions
            left_eye = np.mean(landmarks[0]['facial_area']['left_eye'], axis=0)
            right_eye = np.mean(landmarks[0]['facial_area']['right_eye'], axis=0)
            
            # Calculate angle
            eye_angle = np.degrees(np.arctan2(right_eye[1] - left_eye[1], right_eye[0] - left_eye[0]))
            
            # Rotate image
            center = (w//2, h//2)
            rotation_matrix = cv2.getRotationMatrix2D(center, eye_angle, 1.0)
            aligned_face = cv2.warpAffine(face_img, rotation_matrix, (w, h))
            
            return aligned_face
            
        except Exception as e:
            self.logger.warning(f"Error in face alignment: {str(e)}")
            return image[y:y+h, x:x+w]

    def process_image(self, image_path: str) -> Dict[str, Any]:
        """Process an image and return detected faces with metadata"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            # Convert to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Detect faces
            faces = self.detect_faces(image)
            
            # Process each face
            processed_faces = []
            for face in faces:
                # Align face
                aligned_face = self.align_face(image, face)
                
                # Get face quality metrics
                quality_metrics = self._get_face_quality(aligned_face)
                
                processed_faces.append({
                    'location': face,
                    'aligned_face': aligned_face,
                    'quality_metrics': quality_metrics
                })
            
            return {
                'total_faces': len(processed_faces),
                'faces': processed_faces
            }
            
        except Exception as e:
            self.logger.error(f"Error processing image {image_path}: {str(e)}")
            return {
                'total_faces': 0,
                'faces': [],
                'error': str(e)
            }

    def _get_face_quality(self, face_img: np.ndarray) -> Dict[str, float]:
        """Get quality metrics for a face image"""
        quality_metrics = {
            'brightness': 0.0,
            'sharpness': 0.0,
            'contrast': 0.0,
            'blur': 0.0
        }
        
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(face_img, cv2.COLOR_RGB2GRAY)
            
            # Brightness
            brightness = np.mean(gray)
            quality_metrics['brightness'] = 1.0 - abs(brightness - 127) / 127
            
            # Sharpness
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            quality_metrics['sharpness'] = min(np.var(laplacian) / 1000, 1.0)
            
            # Contrast
            quality_metrics['contrast'] = min(np.std(gray) / 128, 1.0)
            
            # Blur
            quality_metrics['blur'] = self._assess_blur(gray)
            
        except Exception as e:
            self.logger.warning(f"Error in quality assessment: {str(e)}")
        
        return quality_metrics

    def _assess_blur(self, gray_img: np.ndarray) -> float:
        """Assess image blur using Laplacian variance"""
        laplacian = cv2.Laplacian(gray_img, cv2.CV_64F)
        variance = np.var(laplacian)
        return min(variance / 1000, 1.0) 