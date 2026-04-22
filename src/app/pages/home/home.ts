import { Component, HostListener, OnInit } from '@angular/core';
import { VueloService, Vuelo } from '../../services/vuelo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'home-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {

  vuelos: Vuelo[] = [];

  vuelosFiltrados: Vuelo[] = [];

  filtroOrigen: string = '';
  filtroDestino: string = '';

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

filtroFecha: string = '';
fechaMinima: string = '';

capacidad: number = 1;

adultos: number = 1;
ninos: number = 0;

mostrarPasajeros: boolean = false;

mensajeError: string = '';

  constructor(private vueloService: VueloService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVuelos();
     const hoy = new Date();
  this.fechaMinima = hoy.toISOString().split('T')[0];
  }

  cargarVuelos() {
    this.vueloService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.vuelosFiltrados = data;
        console.log('Vuelos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
      }
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

filtrar() {

  this.mensajeError = '';

  if (!this.filtroOrigen || !this.filtroDestino || !this.filtroFecha) {
    this.mensajeError = 'Debes completar todos los campos';
    return;
  }

  const totalPasajeros = this.adultos + this.ninos;

  this.vueloService.filtrarVuelos({
    origen: this.filtroOrigen,
    destino: this.filtroDestino,
    fecha: this.filtroFecha,
    adultos: this.adultos,
    ninos: this.ninos
  }).subscribe({
    next: (data) => {

  this.router.navigate(['/vuelos'], {
    queryParams: {
      origen: this.filtroOrigen,
      destino: this.filtroDestino,
      fecha: this.filtroFecha,
      adultos: this.adultos,
      ninos: this.ninos
    }
  });

    },
    error: () => {
      this.mensajeError = 'Error al buscar vuelos';
    }
  });
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

@HostListener('document:click', ['$event'])
clickFuera(event: any) {
  if (!event.target.closest('.group')) {
    this.mostrarPasajeros = false;
  }
}

}
