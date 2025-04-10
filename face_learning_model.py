import os
import cv2
import numpy as np
import face_recognition
from typing import List, Tuple, Dict, Any
import logging
from face_visualizer import FaceVisualizer
from sklearn.cluster import DBSCAN

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FaceLearningModel:
    def __init__(self):
        self.face_encodings = []
        self.person_metadata = {}
        self.clustering_model = DBSCAN(eps=0.6, min_samples=3)
        self.face_visualizer = FaceVisualizer()
        
    def _preprocess_image(self, image):
        """Preprocess the image for better face detection."""
        if image is None:
            return None
            
        # Convert to RGB (face_recognition uses RGB)
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
        return image
        
    def _get_face_quality(self, face_image) -> Dict[str, float]:
        """Assess the quality of a face image."""
        quality_scores = {}
        
        # Brightness
        brightness = np.mean(face_image)
        quality_scores['brightness'] = brightness / 255.0
        
        # Contrast
        contrast = np.std(face_image)
        quality_scores['contrast'] = contrast / 128.0
        
        # Sharpness using Laplacian variance
        gray = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        quality_scores['sharpness'] = np.var(laplacian) / 100.0
        
        return quality_scores
        
    def _get_face_encodings(self, image) -> Tuple[List[np.ndarray], List[Tuple[int, int, int, int]], List[Dict[str, float]], List[Dict[str, Any]]]:
        """Get face encodings, locations, quality scores and characteristics from an image."""
        try:
            # Find all face locations in the image
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                return [], [], [], []
                
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            # Get quality scores and characteristics for each face
            quality_scores = []
            characteristics = []
            
            for face_location in face_locations:
                top, right, bottom, left = face_location
                face_image = image[top:bottom, left:right]
                
                # Get quality scores
                quality = self._get_face_quality(face_image)
                quality_scores.append(quality)
                
                # Get face characteristics using face_recognition landmarks
                face_landmarks = face_recognition.face_landmarks(image, [face_location])[0]
                char_dict = {
                    'has_eyes': len(face_landmarks.get('left_eye', [])) > 0 and len(face_landmarks.get('right_eye', [])) > 0,
                    'has_nose': len(face_landmarks.get('nose_bridge', [])) > 0,
                    'has_mouth': len(face_landmarks.get('top_lip', [])) > 0,
                    'face_shape': 'normal'  # This is a placeholder, could be enhanced
                }
                characteristics.append(char_dict)
            
            return face_encodings, face_locations, quality_scores, characteristics
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return [], [], [], []
            
    def process_image(self, image_path: str) -> List[Dict[str, Any]]:
        """Process an image and return face analysis results."""
        try:
            # Read and preprocess the image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image at {image_path}")
                
            # Convert to RGB for face_recognition
            image = self._preprocess_image(image)
            
            # Get face information
            face_encodings, face_locations, quality_scores, characteristics = self._get_face_encodings(image)
            
            if not face_encodings:
                return []
                
            results = []
            for idx, (encoding, location, quality, chars) in enumerate(zip(face_encodings, face_locations, quality_scores, characteristics)):
                # Convert face location to more intuitive format
                top, right, bottom, left = location
                face_dict = {
                    'location': {
                        'top': top,
                        'right': right,
                        'bottom': bottom,
                        'left': left,
                        'width': right - left,
                        'height': bottom - top
                    },
                    'quality': quality,
                    'characteristics': chars
                }
                
                # Get additional characteristics from visualizer
                face_region = image[top:bottom, left:right]
                additional_chars = self.face_visualizer.create_characteristics_report(face_region)
                face_dict['additional'] = additional_chars
                
                # Find similar faces in our database
                if self.face_encodings:
                    distances = face_recognition.face_distance(self.face_encodings, encoding)
                    min_distance = min(distances)
                    if min_distance < 0.6:  # Threshold for face similarity
                        face_dict['person_id'] = str(np.argmin(distances))
                        face_dict['confidence'] = 1 - min_distance
                    else:
                        face_dict['person_id'] = str(len(self.face_encodings))
                        face_dict['confidence'] = 1.0
                        self.face_encodings.append(encoding)
                else:
                    face_dict['person_id'] = '0'
                    face_dict['confidence'] = 1.0
                    self.face_encodings.append(encoding)
                
                results.append(face_dict)
            
            return results
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return []
            
    def get_person_statistics(self) -> Dict[str, Any]:
        """Get statistics about recognized persons."""
        stats = {
            'total_faces': len(self.face_encodings),
            'unique_persons': len(set(self.person_metadata.keys())),
            'person_details': {}
        }
        
        for person_id, metadata in self.person_metadata.items():
            stats['person_details'][person_id] = {
                'face_count': metadata.get('face_count', 0),
                'average_quality': metadata.get('average_quality', {}),
                'characteristics': metadata.get('characteristics', {})
            }
        
        return stats 