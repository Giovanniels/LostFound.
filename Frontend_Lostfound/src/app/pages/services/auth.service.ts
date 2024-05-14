import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Método para decodificar el token y obtener el ID y el nombre del usuario
  getUserInfoFromToken(token: string) {
    try {
      // Decodifica el token
      const tokenPayload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      
      // Extrae el ID y el nombre del usuario del token decodificado
      const userId = decodedPayload.userId;
      const name = decodedPayload.name;
      
      // Retorna el ID y el nombre del usuario como un objeto
      return { userId, name };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
