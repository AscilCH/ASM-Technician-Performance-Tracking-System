import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from '../api/reclamation';
import { map, Observable } from 'rxjs';

@Injectable()
export class ReclamationService {
    private apiUrl = 'http://127.0.0.1:8000/api/reclamation'; // Replace with your API URL

    constructor(private http: HttpClient) { }

    getRecs(): Observable<Reclamation[]> {
        console.log("Fetching reclamations");
        return this.http.get<Reclamation[]>(this.apiUrl);
    }

    addRec(reclamation: Reclamation): Observable<Reclamation> {
        console.log("Adding reclamation");
        return this.http.post<Reclamation>(this.apiUrl, reclamation);
    }

    updateRec(reclamation: Reclamation): Observable<Reclamation> {
        console.log("Updating reclamation");
        const url = `${this.apiUrl}/${reclamation.id}`; // Assuming the API endpoint for updating a reclamation requires the reclamation ID in the URL
        return this.http.put<Reclamation>(url, reclamation);
    }

    deleteRec(reclamationId: number): Observable<any> {
        const url = `${this.apiUrl}/${reclamationId}`; // Assuming the API endpoint for deleting a reclamation requires the reclamation ID in the URL
        return this.http.delete<any>(url);
    }

    affecterRec(reclamation: Reclamation): Observable<Reclamation> {
        console.log("Affecting reclamation");
        const url = `${this.apiUrl}/${reclamation.id}`; // Assuming the API endpoint for updating a reclamation requires the reclamation ID in the URL
        return this.http.put<Reclamation>(url, reclamation);
    }
    getReclamationsToday(): Observable<Reclamation[]> {
        const today = new Date().toISOString().split('T')[0]; // Gets the date in YYYY-MM-DD format
        return this.http.get<Reclamation[]>(this.apiUrl).pipe(
            map((reclamations: Reclamation[]) => 
                reclamations.filter(reclamation => 
                    new Date(reclamation.created_at).toISOString().split('T')[0] === today
                )
            )
        );
    }
    getTotalReclamations(): Observable<number> {
        return this.http.get<Reclamation[]>(this.apiUrl).pipe(
            map((reclamations: Reclamation[]) => reclamations.length)
        );
    }
    getReclamationsThisMonth(): Observable<number> {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        return this.http.get<Reclamation[]>(this.apiUrl).pipe(
            map((reclamations: Reclamation[]) => 
                reclamations.filter(reclamation => {
                    const recDate = new Date(reclamation.created_at );
                    return recDate.getMonth() === thisMonth && recDate.getFullYear() === thisYear;
                }).length
            )
        );
    }
}
