import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environmemts';
import { Observable } from 'rxjs';
import { Fichas } from '../interface/fichas';

@Injectable({
  providedIn: 'root'
})
export class FichasService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBackEnd = `${environments.urlBackEnd}/v1/api/fichas`;

  findAll(): Observable<Fichas[]> {
    return this.http.get<Fichas[]>(this.urlBackEnd);
  }

  findByState(estado: boolean): Observable<Fichas[]> {
    return this.http.get<Fichas[]>(`${this.urlBackEnd}/estado/${estado}`);
  }

  findById(id: number): Observable<Fichas> {
    return this.http.get<Fichas>(`${this.urlBackEnd}/${id}`);
  }

  save(fichas: Fichas): Observable<Fichas> {
    return this.http.post<Fichas>(`${this.urlBackEnd}/save`, fichas);
  }

  update(fichas: Fichas): Observable<Fichas> {
    return this.http.put<Fichas>(`${this.urlBackEnd}/update/${fichas.id}`, fichas);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBackEnd}/delete/${id}`);
  }

  restore(id: number): Observable<void> {
    return this.http.put<void>(`${this.urlBackEnd}/restore/${id}`, {});
  }
}
