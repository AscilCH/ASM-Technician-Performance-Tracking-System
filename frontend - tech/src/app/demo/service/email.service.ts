import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://127.0.0.1:8000/api/send-email';

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const emailData = { to, subject, body };
    console.log(emailData);
    return this.http.post(this.apiUrl, emailData);
  }
}

