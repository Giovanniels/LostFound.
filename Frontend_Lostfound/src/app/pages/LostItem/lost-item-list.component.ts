import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LostItemsService, TipoService } from './lost-item.service';

@Component({
  selector: 'app-lost-item-list',
  templateUrl: './lost-item-list.component.html',
  styleUrls: ['./lost-item-list.component.css']
})
export class LostItemsListComponent implements OnInit {
  lostItems: any[] = [];
  filteredItems: any[] = [];
  tipos: any[] = [];
  tipo: string = '';
  errorMessage: string = '';
  previousState: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(
    private lostItemsService: LostItemsService,
    private tipoService: TipoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLostItems();
    this.loadTipos();
  }

  loadLostItems(): void {
    this.lostItemsService.getLostItems().subscribe({
      next: (response: any) => {
        if (response.state === 'Success' && Array.isArray(response.data)) {
          this.lostItems = response.data.sort((a: any, b: any) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.filteredItems = this.lostItems;
        } else {
          console.error("La respuesta del servicio no es válida:", response);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener los elementos perdidos:", error);
      }
    });
  }

  loadTipos(): void {
    this.tipoService.getTipos().subscribe({
      next: (response: any) => {
        if (response.state === 'Success' && Array.isArray(response.data)) {
          this.tipos = response.data;
        } else {
          console.error("La respuesta del servicio de tipos no es válida:", response);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener los tipos:", error);
      }
    });
  }

  goBackprincipal(): void {
    this.router.navigate(['/lost-items']);
  }

  getLastIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  showPreviousButton(): boolean {
    return this.currentPage > 1;
  }

  showNextButton(): boolean {
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    return this.currentPage < totalPages;
  }

  getTotalPages(): number[] {
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  getRows(): any[] {
    const rows = [];
    for (let i = 0; i < this.filteredItems.length; i += 3) {
      rows.push(this.filteredItems.slice(i, i + 3));
    }
    return rows;
  }

  getImageUrl(item: any): string {
    const defaultImage = 'assets/default-icon.png';
    if (!item || !item.imagen || typeof item.imagen !== 'string') {
      return defaultImage;
    }

    const baseUrl = 'http://146.83.198.35:1606';
    const imagePath = item.imagen.replace(/\\/g, '/');
    const imageUrl = `${baseUrl}/uploads/documents/${imagePath}`;

    return imageUrl;
  }

  searchByType(): void {
    if (this.tipo.trim()) {
      this.previousState = this.lostItems.slice();
      this.lostItemsService.searchLostItemsByType(this.tipo.trim()).subscribe({
        next: (response: any) => {
          if (response.success && Array.isArray(response.objetosPerdidos)) {
            this.filteredItems = response.objetosPerdidos;
            this.currentPage = 1;
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
            this.lostItems = response.data;
            this.filteredItems = response.data;
            this.currentPage = 1;
            this.errorMessage = '';
          } else {
            console.error("La respuesta del servicio no es válida:", response);
            this.errorMessage = "No se encontraron publicaciones para este usuario.";
            this.lostItems = [];
            this.filteredItems = [];
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
    console.log('Item:', itemId);
    if (itemId) {
      this.router.navigate(['/lost-item-detail', itemId]);
    } else {
      console.error("El ID del objeto perdido no está definido.");
    }
  }

  navigateToCreateLostItem(): void {
    this.router.navigate(['/create-lost-item']);
  }
}