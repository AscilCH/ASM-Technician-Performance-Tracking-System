// client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Client } from '../api/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://127.0.0.1:8000/api/clients'; // Adjust this URL as needed

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getEmailClientById(id: number): Observable<string | undefined> {
    return this.getClients().pipe(
      map(clients => {
        const client = clients.find(c => c.id === id);
        return client ? client.email : undefined;
      })
    );
  }
}
