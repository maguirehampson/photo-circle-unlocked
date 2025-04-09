import cv2
import numpy as np
import os
from datetime import datetime

def detect_faces(image_path, output_dir='test_results'):
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not read image at {image_path}")
        return 0, None

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load the face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    # Draw rectangles around the faces and add text
    for i, (x, y, w, h) in enumerate(faces):
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(image, f'Face {i+1}', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    # Generate output filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.basename(image_path)
    output_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_{timestamp}.jpg")
    
    # Save the result
    cv2.imwrite(output_path, image)
    print(f"Found {len(faces)} faces in the image")
    print(f"Result saved to {output_path}")
    return len(faces), output_path

def process_directory(input_dir, output_dir='test_results'):
    results = []
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(root, file)
                print(f"\nProcessing {image_path}")
                face_count, output_path = detect_faces(image_path, output_dir)
                if face_count > 0:  # Only add successful detections
                    results.append({
                        'input_path': image_path,
                        'output_path': output_path,
                        'face_count': face_count
                    })
    return results

if __name__ == "__main__":
    # Process all images in the test_dataset directory
    test_results = process_directory('test_dataset')
    
    # Print summary
    print("\nTest Results Summary:")
    print("====================")
    for result in test_results:
        print(f"Image: {os.path.basename(result['input_path'])}")
        print(f"Faces detected: {result['face_count']}")
        print(f"Output saved to: {result['output_path']}")
        print("---") 