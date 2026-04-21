import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AnalysisResult {
  status: string;
  confidence: number;
  recommendation: string;
}

@Component({
  selector: 'app-upload-image-component',
  imports: [CommonModule],
  templateUrl: './upload-image-component.html',
  styleUrl: './upload-image-component.css',
})
export class UploadImageComponent {
  uploadedImage: string | null = null;
  fileName: string = '';
  isDragOver = false;
  isAnalyzing = false;
  errorMessage: string | null = null;
  analysisResult: AnalysisResult | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please upload a valid image file';
      return;
    }

    this.errorMessage = null;
    this.fileName = file.name;
    this.analysisResult = null;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.uploadedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  analyzeImage(): void {
    if (!this.uploadedImage) return;

    this.isAnalyzing = true;
    this.errorMessage = null;

    // Simulate API call
    setTimeout(() => {
      this.analysisResult = {
        status: 'Healthy',
        confidence: 92,
        recommendation: 'No disease detected. Continue normal care.',
      };
      this.isAnalyzing = false;
    }, 2000);
  }

  resetUpload(): void {
    this.uploadedImage = null;
    this.fileName = '';
    this.analysisResult = null;
    this.errorMessage = null;
  }
}
