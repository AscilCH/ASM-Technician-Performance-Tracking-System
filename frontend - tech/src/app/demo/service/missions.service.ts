import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mission } from '../api/mission';
import { catchError, map, Observable, of } from 'rxjs';
import { TechMiss } from "../api/techmisses";
import { AuthService } from '../components/auth/auth.service';
@Injectable()
export class MissionService {
  private apiUrl = 'http://127.0.0.1:8000/api/missions'; // Replace with your API URL
  private apiUrl1 = 'http://127.0.0.1:8000/api/techniciens';
  messageService: any;
  constructor(private http: HttpClient, private authService: AuthService) { }

 

  getMiss(): Observable<Mission[]> {
    return this.getTechmisses().pipe(
      catchError(error => {
        console.error('Error fetching missions:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching missions', life: 3000 });
        return of([] as Mission[]); // Return an empty array to handle the error gracefully
      })
    );
  }
  getTechmisses(): Observable<Mission[]> {

    return this.http.get<Mission[]>(`${this.apiUrl1}/${this.authService.getTechId()}/missions`);
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
  
  getMissionStatusDistribution(): Observable<{ status: string, count: number }[]> {
    const currentYear = new Date().getFullYear();
    const techId = this.authService.getTechId();
  
    return this.http.get<Mission[]>(`${this.apiUrl1}/${techId}/missions`).pipe(
      map((missions: Mission[]) => {
        const statusCounts = missions.reduce((acc, mission) => {
          const startYear = new Date(mission.DateDeb).getFullYear();
          const endYear = new Date(mission.DateFin).getFullYear();
  
          // Inclure les missions dont la date de début est dans l'année précédente et la date de fin dans l'année en cours
          if ((startYear <= currentYear && endYear >= currentYear) || 
              (startYear === currentYear && endYear === currentYear)) {
            acc[mission.Status] = (acc[mission.Status] || 0) + 1;
          }
  
          return acc;
        }, {});
  
        return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
      }),
      catchError(error => {
        console.error('Error fetching missions:', error);
        return of([]);
      })
    );
  }
  
    getInProgressMissionsCountByTechnician(): Observable<number> {
      const techId = this.authService.getTechId();
      return this.http.get<Mission[]>(`${this.apiUrl1}/${techId}/missions`).pipe(
        map((missions: Mission[]) => 
          missions.filter(mission => mission.Status === 'en execution').length
        )
      );
    }
    getInProgressMissionsByTechnician(): Observable<Mission[]> {
      const techId = this.authService.getTechId();
      return this.http.get<Mission[]>(`${this.apiUrl1}/${techId}/missions`).pipe(
        map((missions: Mission[]) => missions.filter(mission => mission.Status === 'en execution'))
      );
    }
  
    getTotalMissionsByTechnician(): Observable<number> {
      const techId = this.authService.getTechId();
      return this.http.get<Mission[]>(`${this.apiUrl1}/${techId}/missions`).pipe(
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
          if (startDate >= sixMonthsAgo && startDate <= now && mission.Status == 'en execution') {
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
  getMissionsDoneThisMonth(): Observable<number> {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return this.http.get<Mission[]>(this.apiUrl).pipe(
      map((missions: Mission[]) =>
        missions.filter(mission => {
          const missionDate = new Date(mission.DateDeb);
          return mission.Status === 'executé' &&
            missionDate.getFullYear() === currentYear &&
            missionDate.getMonth() === currentMonth;
        }).length
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
