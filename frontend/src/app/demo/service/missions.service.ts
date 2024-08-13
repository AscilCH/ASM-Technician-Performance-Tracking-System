import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mission } from '../api/mission';
import { map, Observable } from 'rxjs';
import {TechMiss}from "../api/techmisses";
@Injectable()
export class MissionService {
    private apiUrl = 'http://127.0.0.1:8000/api/missions'; // Replace with your API URL
    constructor(private http: HttpClient) { }

    /*   getProducts() {
          return this.http.get<any>('assets/demo/data/products.json')
              .toPromise()
              .then(res => res.data as Product[])
              .then(data => data);
      } */

    getMiss(): Observable<Mission[]> {
        console.log("eee");
        return this.http.get<Mission[]>(this.apiUrl);
    }


    addMiss(product: Mission): Observable<Mission> {
        console.log("added");
        return this.http.post<Mission>(this.apiUrl, product);
    }

    updateMiss(product: Mission): Observable<Mission> {
        console.log("edited");
        const url = `${this.apiUrl}/${product.id}`; // Assuming the API endpoint for updating a product requires the product ID in the URL
        return this.http.put<Mission>(url, product);
    }

    deleteMiss(productId: number): Observable<any> {
        const url = `${this.apiUrl}/${productId}`; // Assuming the API endpoint for deleting a product requires the product ID in the URL
        return this.http.delete<any>(url);
    }
    getTotalMissions(): Observable<number> {
        return this.http.get<Mission[]>(this.apiUrl).pipe(
            map((missions: Mission[]) => missions.length)
        );
    }
    getMissionsStartedLastSixMonths(): Observable<{ month: string, count: number }[]> {
        return this.http.get<Mission[]>(this.apiUrl).pipe(
          map((missions: Mission[]) => {
            const now = new Date();
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            const counts = Array(6).fill(0);
            const monthNames = [];
    
            for (let i = 5; i >= 0; i--) {
              const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
              monthNames.push(date.toLocaleString('default', { month: 'long' }));
            }
    
            missions.forEach(mission => {
              const startDate = new Date(mission.DateDeb);
              if (startDate >= sixMonthsAgo && startDate <= now && mission.Status=='en execution') {
                const monthDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
                if (monthDiff >= 0 && monthDiff < 6) {
                  counts[5 - monthDiff]++;
                }
              }
            });
    
            return counts.map((count, index) => ({ month: monthNames[index], count }));
          })
        );
      }
      getMissionsInProgressCount(): Observable<number> {
        return this.http.get<Mission[]>(this.apiUrl).pipe(
            map((missions: Mission[]) =>
                missions.filter(mission => mission.Status === 'en execution').length
            )
        );
    }
    getMissionsInProgress(): Observable<Mission[]> {
        return this.http.get<Mission[]>(this.apiUrl).pipe(
            map((missions: Mission[]) => missions.filter(mission => mission.Status === 'en execution'))
        );
    }



    affecterMiss(product: TechMiss): Observable<TechMiss> {
        console.log("affected");
        const url = `http://127.0.0.1:8000/api/tech-misses`;
        return this.http.post<TechMiss>(url, product);
    }
    

}
