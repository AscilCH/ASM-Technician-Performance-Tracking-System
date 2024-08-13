
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechMiss } from '../api/techmisses'; // Adjust the path if necessary

@Injectable({
  providedIn: 'root'
})
export class TechMissService {
  private apiUrl = 'http://127.0.0.1:8000/api/tech-misses'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getTechMisses(): Observable<TechMiss[]> {
    return this.http.get<TechMiss[]>(this.apiUrl);
  }
}
