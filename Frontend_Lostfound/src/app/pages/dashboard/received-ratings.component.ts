import { Component, OnInit } from '@angular/core';
import { ValoracionService } from '../dashboard/valoracion.service';
import {  Router } from '@angular/router';

// Definir una interfaz para el objeto de datos que recibimos del servidor
interface ValoracionesResponse {
  success: boolean;
  valoraciones: any[]; // Puedes ajustar este tipo según la estructura real de los datos
  // Otras propiedades si las hubiera
}

@Component({
  selector: 'app-received-ratings',
  templateUrl: './received-ratings.component.html',
  styleUrls: ['./received-ratings.component.css']
})
export class ReceivedRatingsComponent implements OnInit {
  receivedRatings: any[] = [];

  constructor(private valoracionService: ValoracionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener las valoraciones recibidas por el usuario al iniciar el componente
    this.obtenerValoracionesRecibidas();
  }

  goBack(): void {
    this.router.navigate(['/user-profile']); // Cambia la ruta según tu estructura de enrutamiento
  }

  obtenerValoracionesRecibidas() {
    // Obtener el ID del usuario logueado (puedes implementar esto según tu lógica de autenticación)
    const usuarioId = localStorage.getItem('userId'); // Obtener el ID del usuario logueado desde el almacenamiento local

    if (!usuarioId) {
      console.error('No se ha obtenido el ID del usuario logueado.');
      return;
    }

    // Llamar al servicio para obtener las valoraciones recibidas por el usuario
    this.valoracionService.getValoracionesByUsuarioId(usuarioId)
      .subscribe(
        (data: any) => { // Especificamos el tipo de datos como 'any' temporalmente
          const valoracionesResponse: ValoracionesResponse = data;
          this.receivedRatings = valoracionesResponse.valoraciones;
        },
        (error) => {
          console.error('Error al obtener las valoraciones recibidas:', error);
          // Manejar el error según sea necesario
        }
      );
  }
}
