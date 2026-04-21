import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  protected post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected put<T>(endpoint: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
