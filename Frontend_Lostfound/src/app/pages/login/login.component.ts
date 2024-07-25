import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service'; // Importa el AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isSignDivVisible: boolean = true;
  loginObj: any = {};
  signUpObj: any = {};

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private authService: AuthService) {}

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.contrasenaTemporal) {
      console.error('Correo electrónico y contraseña temporal requeridos');
      this.toastr.error('Por favor, ingrese correo electrónico y contraseña temporal');
      return;
    }
  
    this.apiService.login(this.loginObj).subscribe(response => {
      console.log(response);
      if (response.state === 'Success') {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        // Decodificar el token y obtener el ID y el nombre del usuario
        const userInfo = this.authService.getUserInfoFromToken(token);
        if (userInfo) {
          localStorage.setItem('userId', userInfo.userId);
          localStorage.setItem('userName', userInfo.name);
        }

        this.router.navigateByUrl('/lost-items');
      } else {
        console.error('Error de inicio de sesión:', response);
        this.toastr.error('Ha ocurrido un error al iniciar sesión');
      }
    }, error => {
      console.error('Error de inicio de sesión:', error);
      this.toastr.error('Ha ocurrido un error al iniciar sesión');
    });
  }

  toggleSignForm(signForm: string) {
    this.isSignDivVisible = signForm === 'login';
  }

  createUsuario() {
    this.apiService.createUsuario(this.signUpObj).subscribe(response => {
      console.log(response);
      if (response && response.state === 'Success') {
        this.toastr.success('Se ha enviado una clave temporal para acceder a Lostfound a su correo universitario. Por favor, inicie sesión en nuestra página web.');
      }
    }, error => {
      console.error('Error al registrar usuario:', error);
      this.toastr.error('Ha ocurrido un error al registrar usuario');
    });
  }  
}
