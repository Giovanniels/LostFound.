import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';
import { ValoracionService } from './valoracion.service';
import { Router } from '@angular/router'; // Importar el servicio de enrutamiento

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedInUserId: string | null = null;
  loggedInUser: any = null;
  newPassword: string = '';
  averageRating: number = 0;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private valoracionService: ValoracionService,
    private router: Router // Inyectar el servicio de enrutamiento
  ) { }

  ngOnInit(): void {
    this.loggedInUserId = localStorage.getItem('userId');

    if (this.loggedInUserId) {
      this.loadUserData(this.loggedInUserId);
      this.loadUserRating(this.loggedInUserId); // Cargar la valoración del usuario
    } else {
      console.error('No se ha iniciado sesión o no se ha obtenido el ID del usuario.');
    }
  }

  loadUserData(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (userResponse: any) => {
        if (userResponse.state === 'Success') {
          this.loggedInUser = userResponse.data;
        } else {
          console.error("La respuesta del servicio de usuario no es válida:", userResponse);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener la información del usuario:", error);
      }
    });
  }

  changePassword(): void {
    if (!this.newPassword) {
      console.error('Por favor, ingrese la nueva contraseña.');
      this.toastr.error('Por favor, ingrese la nueva contraseña.');
      return;
    }

    const userData = {
      nuevaContraseña: this.newPassword
    };

    this.userService.updateUsuario(this.loggedInUser._id, userData).subscribe({
      next: (response: any) => {
        if (response.state === 'Success') {
          this.toastr.success('La contraseña se ha cambiado con éxito.');
          this.loadUserData(this.loggedInUser._id);
        } else {
          console.error('Error al cambiar la contraseña:', response);
          this.toastr.error('Ha ocurrido un error al cambiar la contraseña.');
        }
      },
      error: (error: any) => {
        console.error('Error al cambiar la contraseña:', error);
        this.toastr.error('Ha ocurrido un error al cambiar la contraseña.');
      }
    });
  }

  loadUserRating(userId: string): void {
    this.valoracionService.obtenerPromedioValoraciones(userId).subscribe({
      next: (averageRating: any) => {
        if (averageRating && averageRating.promedio) {
          // Convertir el promedio a un número entre 1 y 5 para mostrar las estrellas
          this.averageRating = Math.round(averageRating.promedio);
        }
      },
      error: (error: any) => {
        console.error("Error al cargar la valoración del usuario:", error);
      }
    });
  }

  showReceivedRatings(): void {
    // Redirigir a la página de valoraciones recibidas
    this.router.navigate(['/received-ratings']); // Cambia '/received-ratings' por la ruta real de tu página de valoraciones recibidas
  }
}
