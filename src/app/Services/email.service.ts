import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../Models/api-response.model';
import { SendEmailRequest } from '../Models/email.models';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/EmailsRoute`;

  sendEmail(request: SendEmailRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/SendEmail`, request).pipe(
      catchError(error => {
        console.error('Error sending email:', error);
        return throwError(() => error);
      })
    );
  }
}
