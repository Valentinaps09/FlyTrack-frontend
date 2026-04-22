import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VueloResponse } from '../models/vuelo.model';

export interface Vuelo {
  id?: number;
  numeroVuelo: string;
  aerolinea: string;
  origen: string;
  destino: string;
  horaSalida: string;
  puertaEmbarque: string;
  estado: string;
  fecha: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class VueloService {

  private apiUrl = `${environment.apiUrl}/vuelos`;

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl);
  }

  filtrarVuelos(filtros: any): Observable<Vuelo[]> {
    let params = new HttpParams()
      .set('origen', filtros.origen)
      .set('destino', filtros.destino)
      .set('fecha', filtros.fecha)
      .set('adultos', filtros.adultos)
      .set('ninos', filtros.ninos);

    return this.http.get<Vuelo[]>(`${this.apiUrl}/filtrar`, { params });
  }
}