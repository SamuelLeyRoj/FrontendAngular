import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ropa } from '../models/Ropa';
// IMPORTANTE: Importamos el environment para tener la URL de Render
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RopaService {

  private http = inject(HttpClient);

  // CAMBIO CLAVE: Usamos la URL del environment.
  // Si tu Spring Boot NO tiene el prefijo "/api" en el @RequestMapping, quítalo de aquí.
  private apiUrl = `${environment.apiUrl}/ropa`;

  consultarRopa(): Observable<Ropa[]> {
    return this.http.get<Ropa[]>(`${this.apiUrl}/all`);
  }

  consultarRopaUnicoUsuario(): Observable<Ropa[]> {
    return this.http.get<Ropa[]>(`${this.apiUrl}/1`);
  }

  crearRopa(ropa: Ropa): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/crear/1`, ropa);
  }

  eliminarRopa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarRopa(id: number, ropa: Ropa): Observable<Ropa> {
    return this.http.put<Ropa>(`${this.apiUrl}/${id}`, ropa);
  }
}
