import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  loggedUser: any;

  constructor(private authService: AuthService) {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const userInfo = this.authService.getUserInfoFromToken(token);
      if (userInfo) {
        this.loggedUser = userInfo;
      }
    }
  }

  onLogoff() {
    this.authService.logoff();
  }
}
