import os
import json
from datetime import datetime
import requests
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np

class FaceRecognitionTester:
    def __init__(self, api_url="http://localhost:8000"):
        self.api_url = api_url
        self.results_dir = "test_results"
        os.makedirs(self.results_dir, exist_ok=True)
        
    def test_single_image(self, image_path):
        """Test a single image and return detailed results"""
        try:
            with open(image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{self.api_url}/process-image", files=files)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Error testing {image_path}: {str(e)}")
            return None

    def test_directory(self, directory_path):
        """Test all images in a directory and generate a report"""
        results = {
            'total_images': 0,
            'successful_detections': 0,
            'failed_detections': 0,
            'average_confidence': 0,
            'quality_metrics': {
                'brightness': [],
                'sharpness': [],
                'contrast': []
            },
            'detailed_results': []
        }
        
        for root, _, files in os.walk(directory_path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(root, file)
                    print(f"Testing {image_path}...")
                    
                    result = self.test_single_image(image_path)
                    if result:
                        results['total_images'] += 1
                        if result['faces_detected'] > 0:
                            results['successful_detections'] += 1
                            results['failed_detections'] += 0
                            
                            # Collect quality metrics
                            for face in result['face_details']:
                                quality = face['quality_metrics']
                                results['quality_metrics']['brightness'].append(quality['brightness'])
                                results['quality_metrics']['sharpness'].append(quality['sharpness'])
                                results['quality_metrics']['contrast'].append(quality['contrast'])
                                
                                # Calculate average confidence
                                results['average_confidence'] += face['confidence']
                        
                        results['detailed_results'].append({
                            'image_path': image_path,
                            'result': result
                        })
                    else:
                        results['failed_detections'] += 1
        
        # Calculate averages
        if results['successful_detections'] > 0:
            results['average_confidence'] /= results['successful_detections']
            for metric in results['quality_metrics']:
                results['quality_metrics'][metric] = np.mean(results['quality_metrics'][metric])
        
        return results

    def generate_report(self, results, category):
        """Generate a detailed test report with visualizations"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_dir = os.path.join(self.results_dir, f"{category}_{timestamp}")
        os.makedirs(report_dir, exist_ok=True)
        
        # Save raw results
        with open(os.path.join(report_dir, "raw_results.json"), 'w') as f:
            json.dump(results, f, indent=2)
        
        # Generate summary
        summary = f"""
Face Recognition Test Report - {category}
Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

Total Images Tested: {results['total_images']}
Successful Detections: {results['successful_detections']}
Failed Detections: {results['failed_detections']}
Detection Rate: {(results['successful_detections'] / results['total_images'] * 100):.2f}%
Average Confidence: {results['average_confidence']:.2f}

Quality Metrics:
- Average Brightness: {results['quality_metrics']['brightness']:.2f}
- Average Sharpness: {results['quality_metrics']['sharpness']:.2f}
- Average Contrast: {results['quality_metrics']['contrast']:.2f}
"""
        with open(os.path.join(report_dir, "summary.txt"), 'w') as f:
            f.write(summary)
        
        # Generate visualizations
        self._generate_visualizations(results, report_dir)
        
        return report_dir

    def _generate_visualizations(self, results, report_dir):
        """Generate visualizations of test results"""
        # Confidence distribution
        confidences = [face['confidence'] for result in results['detailed_results'] 
                      for face in result['result']['face_details']]
        plt.figure(figsize=(10, 6))
        plt.hist(confidences, bins=20)
        plt.title('Confidence Distribution')
        plt.xlabel('Confidence')
        plt.ylabel('Count')
        plt.savefig(os.path.join(report_dir, 'confidence_distribution.png'))
        plt.close()
        
        # Quality metrics
        metrics = ['brightness', 'sharpness', 'contrast']
        plt.figure(figsize=(15, 5))
        for i, metric in enumerate(metrics):
            plt.subplot(1, 3, i+1)
            values = results['quality_metrics'][metric]
            plt.hist(values, bins=20)
            plt.title(f'{metric.capitalize()} Distribution')
            plt.xlabel(metric)
            plt.ylabel('Count')
        plt.tight_layout()
        plt.savefig(os.path.join(report_dir, 'quality_metrics.png'))
        plt.close()

def main():
    tester = FaceRecognitionTester()
    
    # Test each category
    categories = ['single_faces', 'multiple_faces', 'challenging_conditions']
    for category in categories:
        print(f"\nTesting {category}...")
        results = tester.test_directory(f"test_dataset/{category}")
        report_dir = tester.generate_report(results, category)
        print(f"Report generated in: {report_dir}")

if __name__ == "__main__":
    main() 