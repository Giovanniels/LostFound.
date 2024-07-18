import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LostItemsService, TipoService } from './lost-item.service';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-lost-item',
  templateUrl: './create-lost-item.component.html',
  styleUrls: ['./create-lost-item.component.css']
})
export class CreateLostItemComponent implements OnInit, AfterViewInit {
  createLostItemForm!: FormGroup;
  tipos: { _id: string, nombre: string }[] = [];
  selectedImage: File | null = null;
  map!: L.Map;
  marker!: L.Marker;
  initialLocation!: L.LatLng; // Guardar ubicación inicial
  errorMessage: string | null = null; // Mensaje de error
  @ViewChild('map') mapContainer!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private lostItemsService: LostItemsService,
    private tipoService: TipoService,
    private router: Router,
    private toastr: ToastrService // Para mostrar mensajes de éxito
  ) {}

  ngOnInit(): void {
    this.createLostItemForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      nuevoTipo: [''],
      descripcion: ['', Validators.required],
      detalles: [''],
      ubicacion: ['', Validators.required],
      informacionContacto: [''],
      imagen: [null]
    });

    this.tipoService.getTipos().subscribe(
      (data: any) => {
        this.tipos = data.data;
      },
      error => {
        console.error('Error al obtener los tipos:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.mapContainer) {
      this.initMap();
    } else {
      console.warn('Elemento del mapa no encontrado en la vista.');
    }
  }

  initMap(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';

    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map(this.mapContainer.nativeElement).setView([-36.822674, -73.013235], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker(this.map.getCenter(), {
      draggable: true
    }).addTo(this.map);

    this.initialLocation = this.marker.getLatLng(); // Guardar ubicación inicial

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.createLostItemForm.get('ubicacion')?.setValue(`${position.lat}, ${position.lng}`);
      this.checkLocationChanged(); // Llamar a la función para verificar el cambio de ubicación
    });
  }

  checkLocationChanged(): void {
    const currentLocation = this.marker.getLatLng();
    if (currentLocation.lat === this.initialLocation.lat && currentLocation.lng === this.initialLocation.lng) {
      this.errorMessage = 'Por favor, mueva el marcador para establecer la ubicación.';
    } else {
      this.errorMessage = null;
    }
  }

  get tipoControl() {
    return this.createLostItemForm.get('tipo');
  }

  goBack(): void {
    this.router.navigate(['/lost-items']);
  }

  onTipoChange(): void {
    const tipoControl = this.createLostItemForm.get('tipo');
    const nuevoTipoControl = this.createLostItemForm.get('nuevoTipo');

    if (tipoControl?.value !== 'otro') {
      nuevoTipoControl?.setValue(''); // Limpiar el campo de nuevo tipo
    }
  }

  onSubmit(): void {
    this.errorMessage = null; // Reiniciar mensaje de error al enviar el formulario
    if (this.createLostItemForm.invalid) {
      return;
    }

    const currentLocation = this.marker.getLatLng();
    if (currentLocation.lat === this.initialLocation.lat && currentLocation.lng === this.initialLocation.lng) {
      this.errorMessage = 'Por favor, mueva el marcador para establecer la ubicación.';
      return;
    }

    const newItem = this.createLostItemForm.value;
    const userId = localStorage.getItem('userId');
    if (userId) {
      newItem.userId = userId;
    }

    newItem.detalles = newItem.detalles || 'datos no ingresados';
    newItem.informacionContacto = newItem.informacionContacto || 'datos no ingresados';

    const tipoControl = this.createLostItemForm.get('tipo');
    const nuevoTipoControl = this.createLostItemForm.get('nuevoTipo');
    if (tipoControl && nuevoTipoControl && tipoControl.value === 'otro') {
      const nuevoTipo = nuevoTipoControl.value;
      newItem.tipo = nuevoTipo;
    }

    if (this.selectedImage) {
      this.createLostItemWithImage(newItem);
    } else {
      this.createLostItemWithoutImage(newItem);
    }
  }

  createLostItemWithImage(newItem: any): void {
    if (!this.selectedImage) {
      console.error('No se seleccionó ninguna imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('tipo', newItem.tipo);
    formData.append('nuevoTipo', newItem.nuevoTipo);
    formData.append('descripcion', newItem.descripcion);
    formData.append('detalles', newItem.detalles);
    formData.append('ubicacion', newItem.ubicacion);
    formData.append('informacionContacto', newItem.informacionContacto);
    formData.append('imagen', this.selectedImage, this.selectedImage.name);

    this.lostItemsService.createLostItemWithImage(newItem, this.selectedImage).subscribe(
      () => {
        this.toastr.success('Elemento perdido creado con éxito.'); // Mensaje de éxito
        this.router.navigate(['/lost-items']);
      },
      (error) => {
        if (error.status === 403) {
          this.errorMessage = 'No se puede crear un tipo similar a otro ya creado.'; // Mensaje de error
        } else {
          console.error('Error al crear el elemento perdido con imagen:', error);
          this.errorMessage = 'Error al crear el objeto perdido.';
        }
      }
    );
  }

  createLostItemWithoutImage(newItem: any): void {
    delete newItem.imagen;

    this.lostItemsService.createLostItem(newItem).subscribe(
      (response: any) => {
        if (response && response.data && response.data._id) {
          this.toastr.success('Elemento perdido creado con éxito.'); // Mensaje de éxito
          this.router.navigate(['/lost-items']);
        } else {
          console.error('El objeto de respuesta no tiene la estructura esperada:', response);
        }
      },
      (error) => {
        if (error.status === 403) {
          this.errorMessage = 'No se puede crear un tipo similar a otro ya creado.'; // Mensaje de error
        } else {
          console.error('Error al crear el elemento perdido sin imagen:', error);
          this.errorMessage = 'Error al crear el objeto perdido.';
        }
      }
    );
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedImage = inputElement.files[0];
      console.log('Archivo seleccionado:', this.selectedImage);
    }
  }
}
