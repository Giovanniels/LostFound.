import { Component, OnInit } from '@angular/core';
import { UserService } from './user.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedInUserId: string | null = null;
  loggedInUser: any = null;
  newPassword: string = '';

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loggedInUserId = localStorage.getItem('userId');

    if (this.loggedInUserId) {
      this.loadUserData(this.loggedInUserId);
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

    // Actualiza la contraseña temporal con la nueva contraseña ingresada por el usuario
    const userData = {
      nuevaContraseña: this.newPassword // Cambia el nombre del campo de contraseña temporal
    };

    // Envía la solicitud de actualización al servidor
    this.userService.updateUsuario(this.loggedInUser._id, userData).subscribe({
      next: (response: any) => {
        if (response.state === 'Success') {
          this.toastr.success('La contraseña se ha cambiado con éxito.');
          // Actualiza la información del usuario después de cambiar la contraseña
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
}
