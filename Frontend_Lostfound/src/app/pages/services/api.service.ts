// En api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://146.83.198.35:1606'; // URL base del backend

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(data: any): Observable<any> {
    return this.http.post<any>('http://146.83.198.35:1606/api/usuario/login', data);
  }

  // Método para registrar usuario
  createUsuario(data: any): Observable<any> {
    return this.http.post<any>('http://146.83.198.35:1606/api/usuario', data);
  }

  // Agrega más métodos según sea necesario para interactuar con tu backend
}
