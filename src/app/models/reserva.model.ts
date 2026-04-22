export interface PasajeroDTO {
  nombre: string;
  documento: string;
  fechaNacimiento: string;
  email: string;
}

export interface ReservaRequest {
  vueloId: number;
  pasajeros: PasajeroDTO[];
}

export interface ReservaResponse {
  id: number;
  codigoReserva: string;
  numeroAsiento: string;
  estadoTiquete: string;

  origen: string;
  destino: string;
  fecha: string;

  nombrePasajero: string;
}