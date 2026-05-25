import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoService } from '../../Services/photo.service';
import { AnalysisResult as ApiAnalysisResult, TreatmentResult } from '../../Models/photo.models';
import { HttpEventType } from '@angular/common/http';
import { catchError, finalize, map, switchMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

interface DisplayAnalysisResult {
  status: string;
  recommendation: string;
}

@Component({
  selector: 'app-upload-image-component',
  imports: [CommonModule, TranslateModule],
  templateUrl: './upload-image-component.html',
  styleUrl: './upload-image-component.css',
})
export class UploadImageComponent {
  private photoService = inject(PhotoService);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);

  uploadedImage: string | null = null;
  selectedFile: File | null = null;
  fileName: string = '';
  isDragOver = false;
  isAnalyzing = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  analysisResult: DisplayAnalysisResult | null = null;

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
      this.toastr.error('Please upload a valid image file');
      return;
    }

    this.errorMessage = null;
    this.fileName = file.name;
    this.selectedFile = file;
    this.analysisResult = null;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.uploadedImage = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  analyzeImage(): void {
    if (!this.selectedFile) return;

    this.isAnalyzing = true;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.analysisResult = null;

    this.photoService.uploadPhoto(this.selectedFile).pipe(
      switchMap((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
          this.cdr.detectChanges();
          return of(null);
        }

        if (event.type === HttpEventType.Response) {
          const analysis = event.body;
          if (!analysis || !analysis.prediction) {
            throw new Error('Invalid response from analysis server');
          }

          if (analysis.prediction === 'Normal') {
            return of({
              status: 'Healthy',
              recommendation: 'No disease detected. Continue normal care.',
            });
          }

          const diseaseName = analysis.prediction;
          return this.photoService.getTreatment(diseaseName).pipe(
            map((treatmentResponse) => {
              if (!treatmentResponse || !treatmentResponse.succeeded || !treatmentResponse.data) {
                throw new Error(treatmentResponse?.message || 'Disease detected, but failed to retrieve treatment');
              }
               const treatment = treatmentResponse.data;
               return {
                 status: treatment.title,
                 recommendation: treatment.description,
               };
            })
          );
        }

        return of(null);
      }),
      finalize(() => {
        this.isAnalyzing = false;
        this.uploadProgress = 0;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.analysisResult = result as DisplayAnalysisResult;
          this.toastr.success('Image analyzed successfully');
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
          this.toastr.error(err.error.message);
        } else {
          this.errorMessage = err.message || 'An error occurred during image analysis';
           this.toastr.error(this.errorMessage || 'An error occurred');
        }
        this.cdr.detectChanges();
      }
    });
  }

  resetUpload(): void {
    this.uploadedImage = null;
    this.selectedFile = null;
    this.fileName = '';
    this.analysisResult = null;
    this.errorMessage = null;
    this.uploadProgress = 0;
  }
}
