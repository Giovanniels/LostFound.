import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LostItemsService } from './lost-item.service';

@Component({
  selector: 'app-lost-item-detail',
  templateUrl: './lost-item-detail.component.html',
  styleUrls: ['./lost-item-detail.component.css']
})
export class LostItemDetailComponent implements OnInit {
  lostItem: any = null; // Variable para almacenar el objeto perdido seleccionado
  lostItemDebug: string | null = null; // Variable para mostrar un mensaje de depuración

  constructor(private route: ActivatedRoute, private router: Router, private lostItemsService: LostItemsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id'); // Obtener el ID del objeto perdido de los parámetros de la URL
      if (itemId) {
        this.loadLostItem(itemId); // Cargar los detalles del objeto perdido usando su ID
      }
    });
  }

  loadLostItem(itemId: string): void {
    this.lostItemsService.getLostItemById(itemId).subscribe({
      next: (response: any) => {
        if (response.state === 'Success') {
          this.lostItem = response.data; // Asignar la respuesta directamente a lostItem
        } else {
          console.error("La respuesta del servicio no es válida:", response);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener el objeto perdido:", error);
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/lost-items']); // Redirigir a la lista de objetos perdidos
  }
}
