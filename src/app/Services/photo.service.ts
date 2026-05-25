import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../Models/api-response.model';
import { AnalysisResult, TreatmentResult } from '../Models/photo.models';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoService  {

  constructor(private http:HttpClient, private translate: TranslateService){}
  
  uploadPhoto(file: File): Observable<HttpEvent<AnalysisResult>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<AnalysisResult>('https://riboku314-straberry-space.hf.space/predict', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
 
  getTreatment(diseaseName: string): Observable<ApiResponse<TreatmentResult>> {
    return this.http.get<ApiResponse<TreatmentResult>>(`https://fsm.tryasp.net/api/TreatMent/get-treatment?disease=${diseaseName}&language=${this.translate.currentLang}`);
  }
}
