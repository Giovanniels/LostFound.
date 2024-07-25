import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));
        return !!decodedPayload;
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }

  getUserInfoFromToken(token: string) {
    try {
      const tokenPayload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      const userId = decodedPayload.userId;
      const name = decodedPayload.name;
      return { userId, name };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logoff() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
