import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FoundItemsService, TipoService } from './found-item.service'; // Asegúrate de tener un servicio adecuado para objetos encontrados
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-found-item',
  templateUrl: './create-found-item.component.html',
  styleUrls: ['./create-found-item.component.css']
})
export class CreateFoundItemComponent implements OnInit, AfterViewInit {
  createFoundItemForm!: FormGroup;
  tipos: { _id: string, nombre: string }[] = [];
  selectedImage: File | null = null;
  map!: L.Map;
  marker!: L.Marker;
  initialLocation!: L.LatLng;
  errorMessage: string | null = null;
  @ViewChild('map') mapContainer!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private foundItemsService: FoundItemsService, // Usa el servicio adecuado para objetos encontrados
    private tipoService: TipoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFoundItemForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      nuevoTipo: ['', [this.validateTipoLength]], // Validación personalizada para longitud
      descripcion: ['', Validators.required],
      detalles: [''],
      ubicacion: ['', Validators.required],
      informacionContacto: ['+56', [Validators.required, this.validatePhoneNumber]],
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

    this.initialLocation = this.marker.getLatLng();

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.createFoundItemForm.get('ubicacion')?.setValue(`${position.lat}, ${position.lng}`);
      this.checkLocationChanged();
    });
  }

  checkLocationChanged(): void {
    const currentLocation = this.marker.getLatLng();
    if (currentLocation.lat === this.initialLocation.lat && currentLocation.lng === this.initialLocation.lng) {
      this.errorMessage = 'Por favor, mueva el marcador para establecer la ubicación.';
      this.toastr.error(this.errorMessage, 'Error');
    } else {
      this.errorMessage = null;
    }
  }

  validatePhoneNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.length !== 12) {
      return { 'invalidPhoneNumber': true };
    }
    return null;
  }

  validateTipoLength(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.length > 22) {
      return { 'tipoTooLong': true };
    }
    return null;
  }

  get tipoControl() {
    return this.createFoundItemForm.get('tipo');
  }

  goBack(): void {
    this.router.navigate(['/found-items']); // Asegúrate de tener una ruta para objetos encontrados
  }

  onTipoChange(): void {
    const tipoControl = this.createFoundItemForm.get('tipo');
    const nuevoTipoControl = this.createFoundItemForm.get('nuevoTipo');

    if (tipoControl?.value !== 'otro') {
      nuevoTipoControl?.setValue(''); // Limpiar el campo de nuevo tipo
    }
  }

  cleanText(text: string): string {
    const cleanedText = text.trim().replace(/[^a-zA-Z0-9+ ]/g, '').toLowerCase();
    return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.createFoundItemForm.invalid) {
      if (this.createFoundItemForm.get('informacionContacto')?.hasError('invalidPhoneNumber')) {
        this.toastr.error('Debe ingresar un número correcto', 'Error');
      } else if (this.createFoundItemForm.get('nuevoTipo')?.hasError('tipoTooLong')) {
        this.toastr.error('El nombre no debe superar los 22 caracteres', 'Error');
      } else {
        this.toastr.error('Complete todos los campos obligatorios', 'Error');
      }
      return;
    }

    const currentLocation = this.marker.getLatLng();
    if (currentLocation.lat === this.initialLocation.lat && currentLocation.lng === this.initialLocation.lng) {
      this.errorMessage = 'Por favor, mueva el marcador para establecer la ubicación.';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    const newItem = this.createFoundItemForm.value;
    newItem.descripcion = this.cleanText(newItem.descripcion);
    newItem.detalles = this.cleanText(newItem.detalles || 'datos no ingresados');
    newItem.informacionContacto = newItem.informacionContacto;
    newItem.ubicacion = this.createFoundItemForm.get('ubicacion')?.value;

    const tipoControl = this.createFoundItemForm.get('tipo');
    const nuevoTipoControl = this.createFoundItemForm.get('nuevoTipo');
    if (tipoControl && nuevoTipoControl && tipoControl.value === 'otro') {
      const nuevoTipo = this.cleanText(nuevoTipoControl.value);
      newItem.tipo = nuevoTipo;
    }

    if (this.selectedImage) {
      this.createFoundItemWithImage(newItem);
    } else {
      this.createFoundItemWithoutImage(newItem);
    }
  }

  createFoundItemWithImage(newItem: any): void {
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

    this.foundItemsService.createFoundItemWithImage(newItem, this.selectedImage).subscribe(
      () => {
        this.toastr.success('Objeto encontrado creado con éxito.');
        this.router.navigate(['/found-items']);
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = 'No se puede crear un tipo similar a otro ya creado.';
          this.toastr.error(this.errorMessage, 'Error');
        } else {
          console.error('Error al crear el objeto encontrado con imagen:', error);
          this.errorMessage = 'Error al crear el objeto encontrado.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      }
    );
  }

  createFoundItemWithoutImage(newItem: any): void {
    delete newItem.imagen;

    this.foundItemsService.createFoundItem(newItem).subscribe(
      (response: any) => {
        if (response && response.data && response.data._id) {
          this.toastr.success('Objeto encontrado creado con éxito.');
          this.router.navigate(['/found-items']);
        } else {
          console.error('El objeto de respuesta no tiene la estructura esperada:', response);
        }
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = 'No se puede crear un tipo similar a otro ya creado.';
          this.toastr.error(this.errorMessage, 'Error');
        } else {
          console.error('Error al crear el objeto encontrado sin imagen:', error);
          this.errorMessage = 'Error al crear el objeto encontrado.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      }
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    } else {
      this.selectedImage = null;
    }
  }
}
