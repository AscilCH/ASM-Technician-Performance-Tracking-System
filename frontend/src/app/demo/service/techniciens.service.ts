import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Technicien } from '../api/technicien';
import { map, Observable } from 'rxjs';

@Injectable()
export class TechService {
    getTechMisses() {
      throw new Error('Method not implemented.');
    }
    private apiUrl = 'http://127.0.0.1:8000/api/techniciens'; // Replace with your API URL
    constructor(private http: HttpClient) { }

    /*   getProducts() {
          return this.http.get<any>('assets/demo/data/products.json')
              .toPromise()
              .then(res => res.data as Product[])
              .then(data => data);
      } */

    getTechniciens(): Observable<Technicien[]> {
        return this.http.get<Technicien[]>(this.apiUrl);
    }


    addTech(product: Technicien): Observable<Technicien> {
        console.log("added");
        return this.http.post<Technicien>(this.apiUrl, product);
    }

    updateTech(product: Technicien): Observable<Technicien> {
        const url = `${this.apiUrl}/${product.id}`; // Assuming the API endpoint for updating a product requires the product ID in the URL
        return this.http.put<Technicien>(url, product);
    }

    deleteTech(productId: number): Observable<any> {
        const url = `${this.apiUrl}/${productId}`; // Assuming the API endpoint for deleting a product requires the product ID in the URL
        return this.http.delete<any>(url);
    }


    getEmailTechById(id: number): Observable<string | undefined> {
        return this.getTechniciens().pipe(
          map(techniciens => {
            const technicien = techniciens.find(t => t.id === id);
            return technicien ? technicien.email : undefined;
          })
        );
      }
       // send email to the best tech
      getTechnicienWithHighestScore(): Observable<string | null> {
        return this.getTechniciens().pipe(
          map(techniciens => {
            if (techniciens.length === 0) {
              return null;
            }
    
            const highestScoreTechnicien = techniciens.reduce((prev, current) => {
              return (prev.score > current.score) ? prev : current;
            });
    
            return highestScoreTechnicien.email;
          })
        );
      }
















    /* ---------------------------------------------------------------------- */
    //from template
    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Technicien[])
            .then(data => data);
    }

    getTotalTechniciens(): Observable<number> {
        return this.http.get<Technicien[]>(this.apiUrl).pipe(
            map((techniciens: Technicien[]) => techniciens.length)
        );
    }
    getTechniciensAddedThisYear(): Observable<number> {
        const currentYear = new Date().getFullYear();
        return this.http.get<Technicien[]>(this.apiUrl).pipe(
            map((techniciens: Technicien[]) =>
                techniciens.filter(technicien =>
                    new Date(technicien.created_at).getFullYear() === currentYear
                ).length
            )
        );
    }
    getTop5Techniciens(): Observable<Technicien[]> {
        return this.http.get<Technicien[]>(this.apiUrl).pipe(
          map(techniciens => techniciens.sort((a, b) => b.score - a.score).slice(0, 5))
        );
      }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Technicien[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Technicien[])
            .then(data => data);
    }
}
