import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001'; // Reemplaza esto con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener la información del usuario que ha iniciado sesión
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/usuario/${userId}`);
  }

  // Método para actualizar la información de un usuario
  updateUsuario(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/usuario/${userId}`, userData);
  }
}
