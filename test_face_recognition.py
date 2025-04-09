import face_recognition
import cv2
import numpy as np

# Load a test image
image = face_recognition.load_image_file("test_dataset/single_faces/Headshot.JPG")

# Find all the faces in the image
face_locations = face_recognition.face_locations(image)

print(f"Found {len(face_locations)} face(s) in the image.")

# Convert the image to BGR color (which OpenCV uses)
image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

# Draw rectangles around the faces
for (top, right, bottom, left) in face_locations:
    cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)

# Display the image
cv2.imshow('Face Detection Test', image)
cv2.waitKey(0)
cv2.destroyAllWindows() 