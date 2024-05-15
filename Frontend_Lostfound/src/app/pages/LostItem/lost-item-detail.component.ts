import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LostItemsService, UserService, ValoracionService } from './lost-item.service';

@Component({
  selector: 'app-lost-item-detail',
  templateUrl: './lost-item-detail.component.html',
  styleUrls: ['./lost-item-detail.component.css']
})
export class LostItemDetailComponent implements OnInit {
  lostItem: any = null;
  lostItemDebug: string | null = null;
  user: any = null;
  rating: number = 0;
  comentario: string = '';
  selectedStars: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lostItemsService: LostItemsService,
    private userService: UserService,
    private valoracionService: ValoracionService
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
        const userId = this.lostItem.usuario;
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
        this.loadUserRating(userId); // Cargar el promedio de valoraciones
      },
      error: (error: any) => {
        console.error("Error al obtener el objeto perdido:", error);
      }
    });
  }

  loadUserRating(userId: string): void {
    this.valoracionService.obtenerPromedioValoraciones(userId).subscribe({
      next: (averageRating: any) => {
        if (averageRating && averageRating.promedio) {
          // Convertir el promedio a un número entre 1 y 5 para mostrar las estrellas
          this.rating = Math.round(averageRating.promedio);
        }
      },
      error: (error: any) => {
        console.error("Error al cargar el promedio de valoraciones:", error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lost-items']);
  }

  rateUser(userId: string): void {
    const usuarioQueValora = localStorage.getItem('userId');

    if (!usuarioQueValora) {
      console.error('No se ha iniciado sesión o no se ha obtenido el ID del usuario.');
      return;
    }

    const rating = this.selectedStars;

    const valoracionData = {
      usuarioValorado: userId,
      usuarioQueValora: usuarioQueValora,
      puntaje: rating,
      comentario: this.comentario
    };

    this.valoracionService.crearValoracion(valoracionData).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la solicitud de valoración:', response);
      },
      error: (error: any) => {
        console.error('Error al valorar al usuario:', error);
      }
    });
  }
}
