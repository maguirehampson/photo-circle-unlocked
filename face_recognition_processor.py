import cv2
import numpy as np
import os
from datetime import datetime
import face_recognition
from collections import defaultdict
import shutil
import json
from typing import List, Tuple, Dict, Any
import logging

class FaceRecognitionProcessor:
    def __init__(self, tolerance=0.6, model="hog", num_jitters=1):
        self.known_face_encodings = []
        self.known_face_names = []
        self.person_photos = defaultdict(list)
        self.tolerance = tolerance
        self.next_person_id = 1
        self.model = model  # "hog" or "cnn"
        self.num_jitters = num_jitters
        self.face_detection_models = ["hog", "cnn"]
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger('FaceRecognition')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image to improve face detection"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Apply histogram equalization
        gray = cv2.equalizeHist(gray)
        
        # Convert back to RGB
        return cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

    def _detect_faces_multiple_models(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces using multiple models and combine results"""
        all_face_locations = []
        
        for model in self.face_detection_models:
            try:
                face_locations = face_recognition.face_locations(image, model=model)
                all_face_locations.extend(face_locations)
            except Exception as e:
                self.logger.warning(f"Error using {model} model: {str(e)}")
        
        # Remove duplicate detections
        unique_face_locations = []
        for face in all_face_locations:
            if not any(self._is_similar_face(face, existing) for existing in unique_face_locations):
                unique_face_locations.append(face)
        
        return unique_face_locations

    def _is_similar_face(self, face1: Tuple[int, int, int, int], face2: Tuple[int, int, int, int], 
                        threshold: float = 0.3) -> bool:
        """Check if two face detections are likely the same face"""
        top1, right1, bottom1, left1 = face1
        top2, right2, bottom2, left2 = face2
        
        # Calculate IoU (Intersection over Union)
        x_left = max(left1, left2)
        y_top = max(top1, top2)
        x_right = min(right1, right2)
        y_bottom = min(bottom1, bottom2)
        
        if x_right < x_left or y_bottom < y_top:
            return False
            
        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        face1_area = (right1 - left1) * (bottom1 - top1)
        face2_area = (right2 - left2) * (bottom2 - top2)
        
        iou = intersection_area / float(face1_area + face2_area - intersection_area)
        return iou > threshold

    def get_face_encodings(self, image_path: str) -> Tuple[np.ndarray, List[Tuple[int, int, int, int]], List[np.ndarray]]:
        """Get face encodings with improved detection"""
        # Load image
        image = face_recognition.load_image_file(image_path)
        
        # Preprocess image
        processed_image = self._preprocess_image(image)
        
        # Detect faces using multiple models
        face_locations = self._detect_faces_multiple_models(processed_image)
        
        if not face_locations:
            self.logger.warning(f"No faces detected in {image_path}")
            return image, [], []
        
        # Get face encodings with multiple jitters for better accuracy
        face_encodings = face_recognition.face_encodings(
            processed_image, 
            face_locations,
            num_jitters=self.num_jitters
        )
        
        return image, face_locations, face_encodings

    def process_image(self, image_path: str, output_dir: str = 'processed_results') -> List[Dict[str, Any]]:
        self.logger.info(f"Processing {image_path}")
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Get face information
        image, face_locations, face_encodings = self.get_face_encodings(image_path)
        
        if not face_locations:
            self.logger.warning(f"No faces found in {image_path}")
            return []
        
        # Convert image for OpenCV
        image_cv = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Process each face in the image
        face_data = []
        for idx, (face_encoding, face_location) in enumerate(zip(face_encodings, face_locations)):
            # Try to match with known faces
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.tolerance)
            
            # Calculate face distances for better matching
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            
            person_id = None
            best_match_index = None
            if True in matches:
                # Find the best match
                best_match_index = np.argmin(face_distances)
                if face_distances[best_match_index] < self.tolerance:
                    person_id = self.known_face_names[best_match_index]
                    self.logger.info(f"Matched face to {person_id} with distance {face_distances[best_match_index]:.2f}")
            else:
                # New person
                person_id = f"Person_{self.next_person_id}"
                self.next_person_id += 1
                self.known_face_encodings.append(face_encoding)
                self.known_face_names.append(person_id)
                self.logger.info(f"Found new person: {person_id}")
            
            # Store photo information for this person
            face_distance = float(face_distances[best_match_index]) if best_match_index is not None else None
            self.person_photos[person_id].append({
                'image_path': image_path,
                'face_location': face_location,
                'timestamp': datetime.now().isoformat(),
                'face_distance': face_distance
            })
            
            # Draw rectangle and label on image
            top, right, bottom, left = face_location
            cv2.rectangle(image_cv, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(image_cv, person_id, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            face_data.append({
                'person_id': person_id,
                'face_location': face_location,
                'face_distance': face_distance
            })
        
        # Save processed image
        output_filename = os.path.join(output_dir, f"processed_{os.path.basename(image_path)}")
        cv2.imwrite(output_filename, image_cv)
        
        return face_data

    def process_directory(self, input_dir: str, output_dir: str = 'processed_results'):
        """Process all images in directory and subdirectories"""
        for root, _, files in os.walk(input_dir):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(root, file)
                    self.process_image(image_path, output_dir)

    def organize_by_person(self, output_base_dir: str = 'organized_faces'):
        """Organize photos by person with improved metadata"""
        os.makedirs(output_base_dir, exist_ok=True)
        
        for person_id, photos in self.person_photos.items():
            person_dir = os.path.join(output_base_dir, person_id)
            os.makedirs(person_dir, exist_ok=True)
            
            # Sort photos by face distance (best matches first)
            photos.sort(key=lambda x: x.get('face_distance', float('inf')))
            
            for idx, photo_data in enumerate(photos):
                src_path = photo_data['image_path']
                ext = os.path.splitext(src_path)[1]
                dst_path = os.path.join(person_dir, f"{person_id}_photo_{idx}{ext}")
                shutil.copy2(src_path, dst_path)
            
            # Save enhanced metadata
            metadata_path = os.path.join(person_dir, 'metadata.json')
            with open(metadata_path, 'w') as f:
                json.dump({
                    'person_id': person_id,
                    'total_photos': len(photos),
                    'photos': photos,
                    'average_face_distance': np.mean([p.get('face_distance', float('inf')) for p in photos])
                }, f, indent=2)

    def save_recognition_data(self, output_file: str = 'recognition_data.json'):
        """Save recognition data with enhanced information"""
        data = {
            'people': {
                person_id: {
                    'total_photos': len(photo_list),
                    'photos': photo_list,
                    'average_face_distance': np.mean([p.get('face_distance', float('inf')) for p in photo_list])
                }
                for person_id, photo_list in self.person_photos.items()
            },
            'settings': {
                'tolerance': self.tolerance,
                'model': self.model,
                'num_jitters': self.num_jitters
            }
        }
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)

if __name__ == "__main__":
    # Initialize processor with improved settings
    processor = FaceRecognitionProcessor(
        tolerance=0.5,  # Lower tolerance for stricter matching
        model="cnn",    # Use CNN model for better accuracy
        num_jitters=3   # More jitters for better encoding
    )
    
    # Process all images
    processor.process_directory('test_dataset')
    
    # Organize photos by person
    processor.organize_by_person()
    
    # Save recognition data
    processor.save_recognition_data()
    
    print("\nProcessing complete!")
    print(f"Found {len(processor.person_photos)} unique people")
    for person_id, photos in processor.person_photos.items():
        avg_distance = np.mean([p.get('face_distance', float('inf')) for p in photos])
        print(f"{person_id}: {len(photos)} photos (avg distance: {avg_distance:.2f})") 