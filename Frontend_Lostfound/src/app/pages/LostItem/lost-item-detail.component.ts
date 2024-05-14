import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LostItemsService, UserService, ValoracionService } from './lost-item.service'; // Importar ambos servicios desde el mismo archivo

@Component({
  selector: 'app-lost-item-detail',
  templateUrl: './lost-item-detail.component.html',
  styleUrls: ['./lost-item-detail.component.css']
})
export class LostItemDetailComponent implements OnInit {
  lostItem: any = null;
  lostItemDebug: string | null = null;
  user: any = null;
  rating: number = 0; // Agregar variable para almacenar la puntuación del usuario
  comentario: string = ''; // Agregar variable para almacenar el comentario del usuario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lostItemsService: LostItemsService,
    private userService: UserService,
    private valoracionService: ValoracionService // Agregar ValoracionService al constructor
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.loadLostItem(itemId);
      }
    });
  }

  loadLostItem(itemId: string): void {
    this.lostItemsService.getLostItemById(itemId).subscribe({
      next: (lostItem: any) => {
        this.lostItem = lostItem;
  
        const userId = this.lostItem.usuario; // Cambio en la obtención del ID de usuario
        this.userService.getUserById(userId).subscribe({
          next: (userResponse: any) => {
            if (userResponse.state === 'Success') {
              this.user = userResponse.data;
            } else {
              console.error("La respuesta del servicio de usuario no es válida:", userResponse);
            }
          },
          error: (error: any) => {
            console.error("Error al obtener la información del usuario:", error);
          }
        });
  
      },
      error: (error: any) => {
        console.error("Error al obtener el objeto perdido:", error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lost-items']);
  }
  
  selectedStars: number = 0; // Variable para almacenar la cantidad de estrellas seleccionadas


  // Método para valorar al usuario
  rateUser(userId: string): void {
    // Obtener el ID del usuario que ha iniciado sesión desde el almacenamiento local
    const usuarioQueValora = localStorage.getItem('userId');
  
    // Verificar si se ha iniciado sesión y se ha obtenido el ID del usuario
    if (!usuarioQueValora) {
      console.error('No se ha iniciado sesión o no se ha obtenido el ID del usuario.');
      // Aquí puedes agregar una lógica para manejar este caso, como redirigir al usuario a la página de inicio de sesión.
      return;
    }
  
    // Convertir selectedStars a number
    const rating = this.selectedStars;
  
    // Crear el objeto de valoración
    const valoracionData = {
      usuarioValorado: userId,
      usuarioQueValora: usuarioQueValora, // Utilizar el ID del usuario que ha iniciado sesión
      puntaje: rating,
      comentario: this.comentario
    };
  
    // Realizar la solicitud HTTP POST a la API
    this.valoracionService.crearValoracion(valoracionData).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la solicitud de valoración:', response);
        // Aquí puedes agregar lógica adicional si es necesario
      },
      error: (error: any) => {
        console.error('Error al valorar al usuario:', error);
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    });
  }
  
  
  

}
