import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VueloService, Vuelo } from '../../services/vuelo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vuelos.html'
})
export class VuelosComponent implements OnInit {

  vuelosFiltrados: Vuelo[] = [];

  origen: string = '';
  destino: string = '';
  fecha: string = '';

  filtroOrigen: string = '';
  filtroDestino: string = '';
  filtroFecha: string = '';

  ciudades: string[] = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Cartagena',
    'Barranquilla',
    'Bucaramanga',
    'Pereira',
    'Santa Marta'
  ];

  ciudadesFiltradasOrigen: string[] = [];
  ciudadesFiltradasDestino: string[] = [];

  adultos: number = 1;
  ninos: number = 0;
  mostrarPasajeros: boolean = false;

  fechaMinima: string = '';
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private vueloService: VueloService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];

    this.route.queryParams.subscribe(params => {

      this.origen = params['origen'] || '';
      this.destino = params['destino'] || '';
      this.fecha = params['fecha'] || '';

      this.filtroOrigen = this.origen;
      this.filtroDestino = this.destino;
      this.filtroFecha = this.fecha;

      console.log("PARAMS:", this.origen, this.destino, this.fecha);

      this.cargarVuelos();
    });
  }

  cargarVuelos() {
    this.vuelosFiltrados =[];
    this.vueloService.filtrarVuelos({
      origen: this.origen,
      destino: this.destino,
      fecha: this.fecha,
      adultos: this.adultos,
      ninos: this.ninos
    }).subscribe(data => {

      console.log("DATA BACK:", data);

      this.vuelosFiltrados = [...data];
      this.cdr.detectChanges();
    });
  }

filtrar() {

  this.mensajeError = '';

  if (!this.filtroOrigen || !this.filtroDestino || !this.filtroFecha) {
    this.mensajeError = 'Debes completar todos los campos';
    return;
  }

  this.origen = this.filtroOrigen;
  this.destino = this.filtroDestino;
  this.fecha = this.filtroFecha;

  this.cargarVuelos();

  this.router.navigate(['/vuelos'], {
    queryParams: {
      origen: this.origen,
      destino: this.destino,
      fecha: this.fecha,
      adultos: this.adultos,
      ninos: this.ninos
    },
  });
}

  filtrarCiudadesOrigen() {
    const valor = this.filtroOrigen.toLowerCase();

    this.ciudadesFiltradasOrigen = this.ciudades.filter(c =>
      c.toLowerCase().includes(valor)
    );
  }

  seleccionarOrigen(ciudad: string) {
    this.filtroOrigen = ciudad;
    this.ciudadesFiltradasOrigen = [];
  }

  filtrarCiudadesDestino() {
    const valor = this.filtroDestino.toLowerCase();

    this.ciudadesFiltradasDestino = this.ciudades.filter(c =>
      c.toLowerCase().includes(valor)
    );
  }

  seleccionarDestino(ciudad: string) {
    this.filtroDestino = ciudad;
    this.ciudadesFiltradasDestino = [];
  }

  togglePasajeros() {
    this.mostrarPasajeros = !this.mostrarPasajeros;
  }

  sumarAdulto() {
    this.adultos++;
  }

  restarAdulto() {
    if (this.adultos > 1) this.adultos--;
  }

  sumarNino() {
    this.ninos++;
  }

  restarNino() {
    if (this.ninos > 0) this.ninos--;
  }

  limpiarError() {
    this.mensajeError = '';
  }

seleccionarVuelo(vuelo: any) {
  this.router.navigate(['/reserva'], {
    state: {
      vueloId: vuelo.id,   
      vuelo: vuelo,        
      adultos: this.adultos,
      ninos: this.ninos
    }
  });
}

  trackByVuelo(index: number, vuelo: any) {
  return vuelo.id || index;
}
}