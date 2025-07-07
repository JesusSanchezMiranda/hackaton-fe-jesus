import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FichasService } from '../../../core/service/fichas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Fichas } from '../../../core/interface/fichas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fichas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fichas-form.component.html',
  styleUrl: './fichas-form.component.scss'
})
export class FichasFormComponent implements OnInit, OnChanges {

  formFicha!: FormGroup;
  isEditMode = false;

  @Input() ficha: Fichas | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() fichaGuardada = new EventEmitter<Fichas>();
  @Output() recargar = new EventEmitter<void>();


  tiposConDetalles = ['libro', 'artículo', 'tesis'];

  constructor(
    private fb: FormBuilder,
    private fichaService: FichasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }



  ngOnInit(): void {
    this.formFicha = this.fb.group({
      id: [null],
      autor: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ. ]+$/)]],
      titulo: ['', Validators.required],
      anio_publicacion: ['', Validators.required],
      tema: ['', Validators.required],
      tipo_ficha: ['', Validators.required],
      editorial: ['', [Validators.minLength(3), Validators.pattern(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,&\-() ]+$/)]],
      numero_edicion: [null, [Validators.required, Validators.min(1)]],
      numero_paginas: [null, [Validators.required, Validators.min(1)]],
      estado: [true]
    });

    this.formFicha.get('tipo_ficha')?.valueChanges.subscribe(tipo => {
      const requiereDetalles = ['libro', 'artículo', 'tesis'].includes(tipo);

      this.toggleCampo('editorial', requiereDetalles);
      this.toggleCampo('numero_edicion', requiereDetalles);
      this.toggleCampo('numero_paginas', requiereDetalles);
    });
  }

  toggleCampo(campo: string, requerido: boolean) {
    const control = this.formFicha.get(campo);
    if (!control) return;
    if (requerido) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ficha'] && this.ficha) {
      this.isEditMode = true;
      setTimeout(() => {
        this.formFicha?.patchValue(this.ficha!);
      });
    } else if (!this.ficha && this.formFicha) {
      this.isEditMode = false;
      this.formFicha.reset();
      this.formFicha.get('estado')?.setValue(true);
    }
  }


  requiereDetalles(): boolean {
    const tipo = this.formFicha.get('tipo_ficha')?.value;
    return this.tiposConDetalles.includes(tipo);
  }


 guardarFicha(): void {
  if (this.formFicha.invalid) return;

  const ficha = { ...this.formFicha.value };

  // Limpieza si no requiere detalles
  if (!this.requiereDetalles()) {
    ficha.editorial = null;
    ficha.numero_edicion = null;
    ficha.numero_paginas = null;
  }

  const peticion = this.isEditMode
    ? this.fichaService.update(ficha)
    : this.fichaService.save(ficha);

  peticion.subscribe(() => {
    Swal.fire({
      icon: 'success',
      title: this.isEditMode ? 'Ficha actualizada' : 'Ficha registrada',
      text: 'La ficha se ha guardado correctamente.',
      confirmButtonText: 'Aceptar',
      timer: 2000,
      timerProgressBar: true
    });

    this.recargar.emit(); // notifica al padre que actualice la lista
    this.cerrar.emit();   // cierra el modal
  });
}


  cerrarModal(): void {
    this.cerrar.emit();
  }


  cancelar(): void {
    this.cerrar.emit();
    this.router.navigate(['/fichas']);
  }

  showError(campo: string): boolean {
    const control = this.formFicha.get(campo);
    return control?.invalid && control?.touched || false;
  }

  controlClass(campo: string): string {
    const control = this.formFicha.get(campo);
    if (!control?.touched) return '';
    return control.invalid ? 'ng-invalid ng-touched' : 'ng-valid ng-touched';
  }






}
