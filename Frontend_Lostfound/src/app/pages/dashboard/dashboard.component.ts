import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Lógica para cargar datos del dashboard
  }

  navigateToLostItems(): void {
    this.router.navigate(['/lost-items']); // Ruta para objetos perdidos
  }

  navigateToFoundItems(): void {
    this.router.navigate(['/found-items']); // Ruta para objetos encontrados
  }

  navigateToAccountManagement(): void {
    this.router.navigate(['/account']); // Ruta para gestión de cuenta
  }
}