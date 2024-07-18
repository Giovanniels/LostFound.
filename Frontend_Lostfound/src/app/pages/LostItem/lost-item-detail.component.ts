import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LostItemsService, UserService, ValoracionService } from './lost-item.service';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService
import * as L from 'leaflet';

@Component({
  selector: 'app-lost-item-detail',
  templateUrl: './lost-item-detail.component.html',
  styleUrls: ['./lost-item-detail.component.css']
})
export class LostItemDetailComponent implements OnInit {
  lostItem: any = null;
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
    private lostItemsService: LostItemsService,
    private userService: UserService,
    private valoracionService: ValoracionService,
    private toastr: ToastrService // Inyección de ToastrService
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
        this.initMap();
        this.setWhatsAppLink();
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
        this.loadUserRating(userId);
      },
      error: (error: any) => {
        console.error("Error al obtener el objeto perdido:", error);
      }
    });
  }

  initMap(): void {
    if (this.lostItem && this.lostItem.ubicacion) {
      const coords = this.lostItem.ubicacion.split(',').map((coord: string) => parseFloat(coord.trim()));

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
          .bindPopup(this.lostItem.descripcion)
          .openPopup();
      } else {
        console.error("Coordenadas no válidas:", coords);
      }
    } else {
      console.error("Ubicación no disponible.");
    }
  }

  setWhatsAppLink(): void {
    if (this.lostItem && this.lostItem.informacionContacto) {
      const phone = this.extractPhoneNumber(this.lostItem.informacionContacto);
      if (phone) {
        const message = encodeURIComponent(`Hola, estoy interesado en el objeto perdido: ${this.lostItem.descripcion}`);
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
    this.router.navigate(['/lost-items']);
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
