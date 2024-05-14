// lost-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LostItemsService {
  private apiUrl = 'http://localhost:3001'; // Reemplaza esto con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener todos los objetos perdidos
  getLostItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/objectoPerdido`);
  }

  // Método para obtener las publicaciones de objetos perdidos del usuario actual
  getUserLostItems(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/objectoPerdido/user/${userId}`);
  }

  // Método para crear un objeto perdido
  createLostItem(item: any): Observable<any> {
    const userId = localStorage.getItem('userId'); // Obtener el ID de usuario del localStorage
    item.userId = userId; // Agregar el ID de usuario al objeto perdido

    // Mostrar los datos en la consola antes de enviar la solicitud POST al backend
    console.log('Datos a enviar al backend:', item);

    // Enviar la solicitud POST al backend
    return this.http.post<any>(`${this.apiUrl}/api/objectoPerdido`, item);
  }

  // Método para actualizar un objeto perdido existente
  updateLostItem(id: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/objectoPerdido/${id}`, updates);
  }

  // Método para eliminar un objeto perdido existente
  deleteLostItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/objectoPerdido/${id}`);
  }

  // Método para subir una imagen de objeto perdido
  uploadLostItemImage(id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', image);
    return this.http.post<any>(`${this.apiUrl}/api/objectoPerdido/${id}/upload-image`, formData);
  }

  createLostItemWithImage(item: any, image: File): Observable<any> {
    const formData = new FormData();
    const userId = localStorage.getItem('userId') || ''; // Si userId es null, asigna una cadena vacía
    formData.append('userId', userId); // Agregar el ID de usuario al FormData
    formData.append('tipo', item.tipo);
    formData.append('nuevoTipo', item.nuevoTipo || ''); // Si nuevoTipo es null, asigna una cadena vacía
    formData.append('descripcion', item.descripcion);
    formData.append('detalles', item.detalles);
    formData.append('ubicacion', item.ubicacion);
    formData.append('informacionContacto', item.informacionContacto);
    formData.append('imagen', image);
  
    // Enviar la solicitud POST al backend
    return this.http.post<any>(`${this.apiUrl}/api/objectoPerdido`, formData);
  }
  
  
  
  

  searchLostItemsByType(typeName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/objectoPerdido/buscar/${typeName}`);
  }

  // Método para obtener un objeto perdido por su ID
  getLostItemById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/objectoPerdido/${id}`);
  }




}

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private apiUrl = 'http://localhost:3001'; // Reemplaza esto con la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener todos los tipos generales
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/tipo`);
  }
}
