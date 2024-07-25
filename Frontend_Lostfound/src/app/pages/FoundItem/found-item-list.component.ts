import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoundItemsService, TipoService } from './found-item.service'; // Actualiza el servicio importado

@Component({
  selector: 'app-found-item-list', // Cambia el selector si es necesario
  templateUrl: './found-item-list.component.html', // Cambia el archivo de plantilla
  styleUrls: ['./found-item-list.component.css']
})
export class FoundItemsListComponent implements OnInit {
  foundItems: any[] = []; // Cambia el nombre de la variable
  filteredItems: any[] = [];
  tipos: any[] = [];
  tipo: string = '';
  errorMessage: string = '';
  previousState: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(
    private foundItemsService: FoundItemsService, // Cambia el servicio inyectado
    private tipoService: TipoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFoundItems(); // Cambia el método llamado
    this.loadTipos();
  }

  loadFoundItems(): void { // Cambia el nombre del método
    this.foundItemsService.getFoundItems().subscribe({ // Cambia el servicio llamado
      next: (response: any) => {
        if (response.state === 'Success' && Array.isArray(response.data)) {
          this.foundItems = response.data.sort((a: any, b: any) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.filteredItems = this.foundItems;
        } else {
          console.error("La respuesta del servicio no es válida:", response);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener los elementos encontrados:", error); // Cambia el mensaje de error
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
    this.router.navigate(['/found-items']); // Cambia la ruta si es necesario
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
      this.previousState = this.foundItems.slice(); // Cambia la variable utilizada
      this.foundItemsService.searchFoundItemsByType(this.tipo.trim()).subscribe({ // Cambia el servicio llamado
        next: (response: any) => {
          if (response.success && Array.isArray(response.objetosEncontrados)) { // Actualiza la propiedad del objeto
            this.filteredItems = response.objetosEncontrados;
            this.currentPage = 1;
          } else {
            console.error("La respuesta del servicio no es válida:", response);
          }
        },
        error: (error: any) => {
          console.error("Error al buscar elementos encontrados por tipo:", error); // Cambia el mensaje de error
        }
      });
    } else {
      this.loadFoundItems(); // Cambia el método llamado
    }
  }

  loadUserFoundItems(): void { // Cambia el nombre del método
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.foundItemsService.getUserFoundItems(userId).subscribe({ // Cambia el servicio llamado
        next: (response: any) => {
          if (response.state === 'Success' && Array.isArray(response.data)) {
            this.foundItems = response.data;
            this.filteredItems = response.data;
            this.currentPage = 1;
            this.errorMessage = '';
          } else {
            console.error("La respuesta del servicio no es válida:", response);
            this.errorMessage = "No se encontraron publicaciones para este usuario.";
            this.foundItems = [];
            this.filteredItems = [];
          }
        },
        error: (error: any) => {
          console.error("Error al obtener los elementos encontrados del usuario:", error); // Cambia el mensaje de error
          this.errorMessage = "No tiene ninguna publicación realizada en objetos encontrados.";
        }
      });
    } else {
      console.error("No se encontró el ID de usuario en el localStorage");
    }
  }

  goBack(): void {
    this.loadFoundItems(); // Cambia el método llamado
  }

  navigateToFoundItemDetail(itemId: string): void { // Cambia el nombre del método
    console.log('Item:', itemId);
    if (itemId) {
      this.router.navigate(['/found-item-detail', itemId]); // Cambia la ruta si es necesario
    } else {
      console.error("El ID del objeto encontrado no está definido."); // Cambia el mensaje de error
    }
  }

  navigateToCreateFoundItem(): void { // Cambia el nombre del método
    this.router.navigate(['/create-found-item']); // Cambia la ruta si es necesario
  }
}
