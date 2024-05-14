import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LostItemsService } from './lost-item.service';

@Component({
  selector: 'app-lost-item-list',
  templateUrl: './lost-item-list.component.html',
  styleUrls: ['./lost-item-list.component.css']
})
export class LostItemsListComponent implements OnInit {
  lostItems: any[] = [];
  tipo: string = '';
  errorMessage: string = '';
  previousState: any[] = [];

  constructor(private lostItemsService: LostItemsService, private router: Router) { }

  ngOnInit(): void {
    this.loadLostItems();
  }

  loadLostItems(): void {
    this.lostItemsService.getLostItems().subscribe({
      next: (response: any) => {
        if (response.state === 'Success' && Array.isArray(response.data)) {
          this.lostItems = response.data;
        } else {
          console.error("La respuesta del servicio no es válida:", response);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener los elementos perdidos:", error);
      }
    });
  }

  getImageUrl(item: any): string {
    if (!item || !item.imagen || typeof item.imagen !== 'string') {
      return ''; // Devuelve una cadena vacía si no hay imagen o la URL no es una cadena
    }
    
    // Formatea la URL de la imagen para que coincida con la ubicación de almacenamiento en el servidor
    const baseUrl = 'http://localhost:3001'; // URL base del servidor
    const imagePath = item.imagen.replace(/\\/g, '/'); // Reemplaza todas las barras invertidas por barras normales
    const imageUrl = `${baseUrl}/uploads/documents/${imagePath}`; // Combina la URL base con la ruta de la imagen
    
    return imageUrl;
  }
  
  
  

  searchByType(): void {
    if (this.tipo.trim()) {
      this.previousState = this.lostItems.slice();
      this.lostItemsService.searchLostItemsByType(this.tipo.trim()).subscribe({
        next: (response: any) => {
          if (response.success && Array.isArray(response.objetosPerdidos)) {
            this.lostItems = response.objetosPerdidos;
          } else {
            console.error("La respuesta del servicio no es válida:", response);
          }
        },
        error: (error: any) => {
          console.error("Error al buscar elementos perdidos por tipo:", error);
        }
      });
    } else {
      this.loadLostItems();
    }
  }

  loadUserLostItems(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.lostItemsService.getUserLostItems(userId).subscribe({
        next: (response: any) => {
          if (response.state === 'Success' && Array.isArray(response.data)) {
            if (response.data.length > 0) {
              this.previousState = this.lostItems.slice();
            } else {
              this.loadLostItems();
            }
            this.lostItems = response.data;
            this.errorMessage = '';
          } else {
            console.error("La respuesta del servicio no es válida:", response);
            this.errorMessage = "No se encontraron publicaciones para este usuario.";
            this.lostItems = [];
          }
        },
        error: (error: any) => {
          console.error("Error al obtener los elementos perdidos del usuario:", error);
          this.errorMessage = "No tiene ninguna publicación realizada en objetos perdidos.";
        }
      });
    } else {
      console.error("No se encontró el ID de usuario en el localStorage");
    }
  }

  goBack(): void {
    this.loadLostItems();
  }


  navigateToLostItemDetail(itemId: string): void {
    console.log('Item:', itemId); // Depuración: Registro del ID del objeto perdido
    if (itemId) {
      this.router.navigate(['/lost-item-detail', itemId]); // Navega a la página de detalles con el ID del objeto perdido
    } else {
      console.error("El ID del objeto perdido no está definido.");
    }
  }

  navigateToCreateLostItem(): void {
    this.router.navigate(['/create-lost-item']);
  }
}
