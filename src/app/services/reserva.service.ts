import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReservaRequest } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = `${environment.apiUrl}/reservas`;
  private accesoUrl = `${environment.apiUrl}/mis-vuelos`;

  constructor(private http: HttpClient) {}

  /* ============================= */
  /* 🔹 CREAR RESERVA */
  /* ============================= */
  crearReserva(request: ReservaRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

/* ============================= */
/* 🔹 SOLICITAR CÓDIGO */
/* ============================= */
solicitarCodigo(documento: string): Observable<any> {
  return this.http.post(`${this.accesoUrl}/solicitar-codigo`, {
    documento: documento
  });
}

/* ============================= */
/* 🔹 VERIFICAR CÓDIGO */
/* ============================= */
verificarCodigo(documento: string, codigo: string): Observable<any[]> {
  return this.http.post<any[]>(`${this.accesoUrl}/verificar`, {
    documento: documento,
    codigo: codigo
  });
}
}