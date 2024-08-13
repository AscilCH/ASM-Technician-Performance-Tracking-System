import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../api/user';
import { UpdatedUser } from '../../api/updateuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/admins';
  private isLoggedInStatus: boolean = false;
  private logoutUrl = 'http://127.0.0.1:8000/api/admin/logout';
  private uploadPhotoUrl = 'http://127.0.0.1:8000/upload-photo';

  constructor(private router: Router, private http: HttpClient) {}

  getProfile(): Observable<User> {
    const token = this.getResponse().token;
    console.log(this.getResponse().admin_id);
    return this.http.get<User>('http://127.0.0.1:8000/api/me', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
  }

  updateProfile(profileData: UpdatedUser): Observable<any> {
    const id = this.getResponse().admin_id;
    return this.http.put<UpdatedUser>(`http://127.0.0.1:8000/api/admins/${id}`, profileData);
  }

  login(adminId: number) {
    sessionStorage.setItem('admin_id', adminId.toString());
    this.isLoggedInStatus = true;
    this.router.navigate(['/dashboard']);
  }

  veriflogin(email: string, password: string): Observable<any> {
    return this.http.post<any>("http://127.0.0.1:8000/api/admin/login", { email, password });
  }

  setResponse(response: any): void {
    localStorage.setItem('response', JSON.stringify(response));
  }

  getResponse(): any {
    const response = localStorage.getItem('response');
    return response ? JSON.parse(response) : null;
  }

  logout(): void {
    const token = this.getResponse().token;

    if (token) {
      this.performLogout(token).subscribe(
        response => {
          console.log('Logout successful', response);
          this.isLoggedInStatus = false;
          sessionStorage.removeItem('admin_id');
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

  getAdminId(): number | null {
    const adminId = sessionStorage.getItem('admin_id');
    return adminId ? parseInt(adminId, 10) : null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(product: User): Observable<User> {
    console.log("added");
    return this.http.post<User>(this.apiUrl, product);
  }

  // New function to upload photo
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(this.uploadPhotoUrl, formData);
  }

  // New function to get image URL
  getImageUrl(filename: string): string {
    return `http://127.0.0.1:8000/image/${filename}.jpg`;
  }
}
