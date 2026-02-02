import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod'; // Ajusta la ruta si es necesario
import { Ropa } from '../../models/Ropa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RopaService {
  // Usamos la URL de tu environment.
  // IMPORTANTE: Si tu back en Spring Boot no usa "/api", bórralo de aquí.
  private baseUrl = `${environment.apiUrl}/ropa`;

  constructor(private http: HttpClient) { }

  consultarRopa(): Observable<Ropa[]> {
    // Esto llamará a: https://backendsprinboot-1.onrender.com/ropa/all
    return this.http.get<Ropa[]>(`${this.baseUrl}/all`);
  }

  actualizarRopa(id: number, ropa: Ropa): Observable<Ropa> {
    return this.http.put<Ropa>(`${this.baseUrl}/${id}`, ropa);
  }

  eliminarRopa(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
