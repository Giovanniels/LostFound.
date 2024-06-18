import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LostItemsService, TipoService } from './lost-item.service';

@Component({
  selector: 'app-create-lost-item',
  templateUrl: './create-lost-item.component.html',
  styleUrls: ['./create-lost-item.component.css']
})
export class CreateLostItemComponent implements OnInit {
  createLostItemForm!: FormGroup;
  tipos: { _id: string, nombre: string }[] = [];
  selectedImage: File | null = null;
  @ViewChild('imageFileInput') imageFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private lostItemsService: LostItemsService,
    private tipoService: TipoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createLostItemForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      nuevoTipo: [''], // Se mantiene el campo para el nuevo tipo
      descripcion: ['', Validators.required],
      detalles: [''],
      ubicacion: ['', Validators.required],
      informacionContacto: ['', Validators.required],
      imagen: [null] // Se mantiene el campo para la imagen
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

  get tipoControl() {
    return this.createLostItemForm.get('tipo');
  }

  goBack(): void {
    this.router.navigate(['/lost-items']); // Cambia la ruta según tu estructura de enrutamiento
  }

  onSubmit(): void {
    if (this.createLostItemForm.invalid) {
      return;
    }

    const newItem = this.createLostItemForm.value;

    const userId = localStorage.getItem('userId');
    if (userId) {
      newItem.userId = userId;
    }

    const tipoControl = this.createLostItemForm.get('tipo');
    const nuevoTipoControl = this.createLostItemForm.get('nuevoTipo');
    if (tipoControl && nuevoTipoControl && tipoControl.value === 'otro') {
      const nuevoTipo = nuevoTipoControl.value;
      newItem.tipo = nuevoTipo;
    }

    if (this.selectedImage) {
      // Crear elemento perdido con imagen
      this.createLostItemWithImage(newItem);
    } else {
      // Crear elemento perdido sin imagen
      this.createLostItemWithoutImage(newItem);
    }
  }

  createLostItemWithImage(newItem: any): void {
    if (!this.selectedImage) {
      console.error('No se seleccionó ninguna imagen.');
      return;
    }
  
    // Obtener el nuevoTipo del newItem
    const nuevoTipo = newItem.nuevoTipo;
  
  
    // Crear un FormData para enviar los datos y la imagen
    const formData = new FormData();
    formData.append('tipo', newItem.tipo);
    formData.append('nuevoTipo', nuevoTipo);
    formData.append('descripcion', newItem.descripcion);
    formData.append('detalles', newItem.detalles);
    formData.append('ubicacion', newItem.ubicacion);
    formData.append('informacionContacto', newItem.informacionContacto);
    formData.append('imagen', this.selectedImage, this.selectedImage.name); // Agregar la imagen solo si está presente
  
  
    // Enviar la solicitud POST al backend
    this.lostItemsService.createLostItemWithImage(newItem, this.selectedImage).subscribe(
      () => {
        this.router.navigate(['/lost-items']);
      },
      (error) => {
        console.error('Error al crear el elemento perdido con imagen:', error);
      }
    );
  }
  



  createLostItemWithoutImage(newItem: any): void {
    // Elimina la propiedad 'imagen' si no hay imagen seleccionada
    delete newItem.imagen;
  
    this.lostItemsService.createLostItem(newItem).subscribe(
      (response: any) => {
        if (response && response.data && response.data._id) {
          this.router.navigate(['/lost-items']);
        } else {
          console.error('El objeto de respuesta no tiene la estructura esperada:', response);
        }
      },
      (error) => {
        console.error('Error al crear el elemento perdido sin imagen:', error);
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
