import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoundItemsService, UserService, ValoracionService } from './found-item.service';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService
import * as L from 'leaflet';

@Component({
  selector: 'app-found-item-detail',
  templateUrl: './found-item-detail.component.html',
  styleUrls: ['./found-item-detail.component.css']
})
export class FoundItemDetailComponent implements OnInit {
  foundItem: any = null; // Cambiado de lostItem a foundItem
  user: any = null;
  rating: number = 0;
  comentario: string = '';
  selectedStars: number = 0;
  map: any;
  whatsappLink: string = '';
  errorMessage: string | null = null; // Propiedad para el mensaje de error

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foundItemsService: FoundItemsService, // Cambiado de LostItemsService a FoundItemsService
    private userService: UserService,
    private valoracionService: ValoracionService,
    private toastr: ToastrService // Inyección de ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.loadFoundItem(itemId); // Cambiado de loadLostItem a loadFoundItem
      }
    });
  }

  loadFoundItem(itemId: string): void { // Cambiado de loadLostItem a loadFoundItem
    this.foundItemsService.getFoundItemById(itemId).subscribe({ // Cambiado de getLostItemById a getFoundItemById
      next: (foundItem: any) => { // Cambiado de lostItem a foundItem
        this.foundItem = foundItem;
        this.initMap();
        this.setWhatsAppLink();
        const userId = this.foundItem.usuario; // Cambiado de lostItem a foundItem
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
        this.loadUserRating(userId);
      },
      error: (error: any) => {
        console.error("Error al obtener el objeto encontrado:", error); // Cambiado de perdido a encontrado
      }
    });
  }

  initMap(): void {
    if (this.foundItem && this.foundItem.ubicacion) { // Cambiado de lostItem a foundItem
      const coords = this.foundItem.ubicacion.split(',').map((coord: string) => parseFloat(coord.trim())); // Cambiado de lostItem a foundItem

      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        const [lat, lng] = coords;

        this.map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(this.map);

        const icon = L.icon({
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowSize: [41, 41]
        });

        L.marker([lat, lng], { icon }).addTo(this.map)
          .bindPopup(this.foundItem.descripcion) // Cambiado de lostItem a foundItem
          .openPopup();
      } else {
        console.error("Coordenadas no válidas:", coords);
      }
    } else {
      console.error("Ubicación no disponible.");
    }
  }

  setWhatsAppLink(): void {
    if (this.foundItem && this.foundItem.informacionContacto) { // Cambiado de lostItem a foundItem
      const phone = this.extractPhoneNumber(this.foundItem.informacionContacto); // Cambiado de lostItem a foundItem
      if (phone) {
        const message = encodeURIComponent(`Hola, estoy interesado en el objeto encontrado: ${this.foundItem.descripcion}`); // Cambiado de perdido a encontrado
        this.whatsappLink = `https://wa.me/${phone}?text=${message}`;
      }
    }
  }

  extractPhoneNumber(contactInfo: string): string | null {
    const phoneMatch = contactInfo.match(/(\d{9,15})/);
    return phoneMatch ? phoneMatch[0] : null;
  }

  loadUserRating(userId: string): void {
    this.valoracionService.obtenerPromedioValoraciones(userId).subscribe({
      next: (averageRating: any) => {
        if (averageRating && averageRating.promedio) {
          this.rating = Math.round(averageRating.promedio);
        }
      },
      error: (error: any) => {
        console.error("Error al cargar el promedio de valoraciones:", error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/found-items']); // Cambiado de lost-items a found-items
  }

  rateUser(userId: string): void {
    const usuarioQueValora = localStorage.getItem('userId');

    if (!usuarioQueValora) {
      console.error('No se ha iniciado sesión o no se ha obtenido el ID del usuario.');
      return;
    }

    if (usuarioQueValora === userId) {
      this.errorMessage = "No puedes realizar una valoración propia"; // Establecer mensaje de error
      return;
    }

    this.errorMessage = null; // Limpiar mensaje de error si la valoración es válida

    const valoracionData = {
      usuarioValorado: userId,
      usuarioQueValora: usuarioQueValora,
      puntaje: this.selectedStars,
      comentario: this.comentario
    };

    this.valoracionService.crearValoracion(valoracionData).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la solicitud de valoración:', response);
        this.toastr.success('Valoración creada correctamente'); // Notificación de éxito
      },
      error: (error: any) => {
        console.error('Error al valorar al usuario:', error);
        this.toastr.error('Error al crear la valoración'); // Notificación de error
      }
    });
  }
}
