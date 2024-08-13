import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../api/user';
import { UpdatedUser } from '../../api/updateuser';
import { Technicien } from '../../api/technicien';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/techniciens';
  private uploadPhotoUrl = 'http://127.0.0.1:8000/upload-photo';
  private logoutUrl = 'http://127.0.0.1:8000/api/technicien/logout';
  private isLoggedInStatus: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  login(techId: number) {
    sessionStorage.setItem('tech_id', techId.toString());
    this.isLoggedInStatus = true;
    this.router.navigate(['/dashboard']);
  }

  veriflogin(email: string, password: string): Observable<any> {
    return this.http.post<any>("http://127.0.0.1:8000/api/technicien/login", { email, password });
  }

  getTechnicianProfile(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateTechnicianProfile(id: string, profileData: UpdatedUser): Observable<any> {
    return this.http.put<UpdatedUser>(`${this.apiUrl}/${id}`, profileData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(this.uploadPhotoUrl, formData);
  }

  setResponse(response: any): void {
    localStorage.setItem('response', JSON.stringify(response));
  }

  getResponse(): any {
    const response = localStorage.getItem('response');
    return response ? JSON.parse(response) : null;
  }

  logout(): void {
    const token = this.getResponse()?.access_token;
    if (token) {
      this.performLogout(token).subscribe(
        response => {
          console.log('Logout successful', response);
          this.isLoggedInStatus = false;
          sessionStorage.removeItem('tech_id');
          this.router.navigate(['/']);
        },
        error => {
          console.error('Logout failed', error);
        }
      );
    }
  }

  private performLogout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(this.logoutUrl, {}, { headers: headers });
  }

  getTechId(): number | null {
    const adminId = sessionStorage.getItem('tech_id');
    return adminId ? parseInt(adminId, 10) : null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus || !!this.getResponse();
  }

  getUsers(): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(this.apiUrl);
  }

  addUser(product: User): Observable<Technicien> {
    console.log("added");
    return this.http.post<Technicien>(this.apiUrl, product);
  }

  // Method to get image URL (for displaying images)
  getImageUrl(filename: string): string {
    return `http://127.0.0.1:8000/image/${filename}.jpg`;
  }

}
