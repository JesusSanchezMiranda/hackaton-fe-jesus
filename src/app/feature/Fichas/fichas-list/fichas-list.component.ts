import { Component } from '@angular/core';
import { Fichas } from '../../../core/interface/fichas';
import { FichasService } from '../../../core/service/fichas.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-fichas-list',
  imports: [FormsModule, CommonModule],
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
  filtroTipo: string = 'todos'; // o estado, según lo que decidas
  filtroEstado: string = 'todos';


  constructor(private fichasService: FichasService, private router: Router) { }

  requiereDetalle(): boolean {
    return this.filtroTipo === 'todos' || ['libro', 'artículo', 'tesis'].includes(this.filtroTipo);
  }


  ngOnInit(): void {
    this.cargarFichas();
  }

  cargarFichas(): void {
    this.fichasService.findAll().subscribe({
      next: (data) => this.fichas = data,
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

    return coincideTexto && coincideTema && coincideAutor && coincideFecha && coincideTipo;
  });
}




  editarFicha(id: number): void {
    this.router.navigate(['/fichas/editar', id]);
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






}
