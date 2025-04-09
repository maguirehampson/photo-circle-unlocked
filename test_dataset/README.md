# Test Dataset for Facial Recognition

This directory contains test images for evaluating the facial recognition system. The dataset is organized into three main categories:

## Directory Structure

### single_faces/
- Contains images with a single face
- Ideal for testing basic face detection
- Should include various angles and expressions

### multiple_faces/
- Contains images with multiple faces
- Useful for testing face detection in group photos
- Should include different group sizes and arrangements

### challenging_conditions/
- Contains images with challenging conditions such as:
  - Low lighting
  - Partial face occlusion
  - Different angles (profile, tilted)
  - Various expressions
  - Different ethnicities
  - Different ages

## Image Requirements

- Format: JPG or PNG
- Resolution: Minimum 640x480 pixels
- File naming: Use descriptive names (e.g., `single_face_frontal.jpg`, `group_photo_5_people.jpg`)
- Quality: Clear, well-focused images
- Consent: Ensure you have permission to use the images

## Usage

1. Place test images in the appropriate subdirectory
2. Run the face detection script with the desired image path
3. Review the results and adjust parameters as needed

## Notes

- Keep a backup of original images
- Document any special characteristics of each image
- Update this README as the dataset grows 