import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  private apiUrl = 'http://146.83.198.35:1606/api/Valoracion'; // Corregido con la URL correcta

  constructor(private http: HttpClient) { }

  crearValoracion(valoracionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rate`, valoracionData);
  }

  getValoracionesByUsuarioId(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}`);
  }

  obtenerPromedioValoraciones(usuarioId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/promedio/${usuarioId}`); // Corregido con la ruta correcta
  }
}
