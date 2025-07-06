import { Component } from '@angular/core';
import { Fichas } from '../../../core/interface/fichas';
import { FichasService } from '../../../core/service/fichas.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FichasFormComponent } from '../fichas-form/fichas-form.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);


@Component({
  selector: 'app-fichas-list',
  standalone: true,
  imports: [FormsModule, CommonModule, FichasFormComponent],
  templateUrl: './fichas-list.component.html',
  styleUrl: './fichas-list.component.scss'
})
export class FichasListComponent {

  
  fichas: Fichas[] = [];
  filtro: string = '';

  filtroTexto: string = '';
  filtroTema: string = '';
  filtroAutor: string = '';
  filtroFecha: string = '';
  filtroTipo: string = 'todos'; 
  filtroEstado: string = 'todos';


  constructor(private fichasService: FichasService, private router: Router) { }

  modalVisible = false;
fichaSeleccionada: Fichas | null = null;

  requiereDetalle(): boolean {
    return this.filtroTipo === 'todos' || ['libro', 'artículo', 'tesis'].includes(this.filtroTipo);
  }


  ngOnInit(): void {
    this.cargarFichas();
  }

  cargarFichas(): void {
  this.fichasService.findAll().subscribe({
    next: (data) => {
      this.fichas = data.sort((a, b) => b.id - a.id); // ID descendente
    },
    error: (err) => console.error('Error al cargar fichas', err)
  });
}

 aplicarFiltro(): Fichas[] {
  return this.fichas.filter(f => {
    const coincideTexto =
      f.tema.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
      f.autor.toLowerCase().includes(this.filtroTexto.toLowerCase());

    const coincideTema =
      this.filtroTema === '' || f.tema.toLowerCase().includes(this.filtroTema.toLowerCase());

    const coincideAutor =
      this.filtroAutor === '' || f.autor.toLowerCase().includes(this.filtroAutor.toLowerCase());

    const coincideFecha =
      this.filtroFecha === '' || f.fecha_agregada === this.filtroFecha;

    const coincideTipo =
      this.filtroTipo === 'todos' || f.tipo_ficha === this.filtroTipo;

       const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activo' && f.estado === true) ||
        (this.filtroEstado === 'inactivo' && f.estado === false);

      return coincideTexto && coincideTema && coincideAutor && coincideFecha && coincideTipo && coincideEstado;
    })
    .sort((a, b) => b.id - a.id);
}



editarFicha(ficha: Fichas): void {
  this.fichaSeleccionada = ficha;
  this.modalVisible = true;
}

actualizarTabla(ficha: Fichas): void {
  const index = this.fichas.findIndex(f => f.id === ficha.id);

  if (index !== -1) {
    this.fichas[index] = ficha;
  } else {
    this.fichas.push(ficha);
  }
  this.fichas = [...this.fichas];

  this.fichas = [...this.fichas].sort((a, b) => b.id - a.id);

  Swal.fire('Éxito', this.fichaSeleccionada ? 'Ficha actualizada' : 'Ficha creada', 'success');

  this.cerrarModal();
}

onFichaGuardada(): void {
  this.cerrarModal();     
  this.cargarFichas();   
}


  eliminarFicha(ficha: Fichas): void {
    Swal.fire({
      title: '¿Desactivar ficha?',
      text: 'Se marcará como inactiva',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fichasService.delete(ficha.id).subscribe(() => {
          ficha.estado = false;
          Swal.fire('Hecho', 'Ficha desactivada.', 'success');
        });
      }
    });
  }



  restaurarFicha(ficha: Fichas): void {
    Swal.fire({
      title: '¿Restaurar ficha?',
      text: 'Esta ficha volverá a estar activa.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fichasService.restore(ficha.id).subscribe(() => {
          ficha.estado = true;
          Swal.fire('Restaurada', 'La ficha ha sido activada nuevamente.', 'success');
        });
      }
    });
  }


abrirModal(): void {
  this.modalVisible = true;
}

cerrarModal(): void {
  this.modalVisible = false;
  this.fichaSeleccionada = null;
}

reportPdf() {
    this.fichasService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte.pdf'; // nombre temporal
      link.click();
      URL.revokeObjectURL(url);
    });
  }


}
