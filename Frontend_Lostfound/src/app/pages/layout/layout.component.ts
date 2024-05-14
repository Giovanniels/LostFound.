import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  loggedUser: any;

  constructor(private router: Router) {
    const loggedUserString = localStorage.getItem('loggedUser');
    if (loggedUserString !== null) {
      this.loggedUser = JSON.parse(loggedUserString);
    }
  }

  onLogoff() {
    localStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/login');
  }
}
