import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReservaService } from '../../services/reserva.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.html'
})
export class ReservaComponent implements OnInit {

  vuelo: any;
  vueloId!: number;

  pasajeros: any[] = [];
  errores: string[] = [];

  fechaMaxima: string = '';
  mostrarModal = false;
  erroresCampos: { [key: string]: string } = {};

  constructor(private reservaService: ReservaService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    const data = history.state;
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString().split('T')[0];

    if (data && data.vuelo) {
      this.vuelo = data.vuelo;
      this.vueloId = data.vuelo.id;

      const adultos = data.adultos || 1;
      const ninos = data.ninos || 0;

      this.generarPasajeros(adultos, ninos);
    }
  }

  generarPasajeros(adultos: number, ninos: number): void {
    this.pasajeros = [];

    for (let i = 0; i < adultos; i++) {
      this.pasajeros.push(this.nuevoPasajero('Adulto'));
    }

    for (let i = 0; i < ninos; i++) {
      this.pasajeros.push(this.nuevoPasajero('Niño'));
    }
  }

  nuevoPasajero(tipo: string) {
    return {
      tipo,
      nombre: '',
      documento: '',
      fechaNacimiento: '',
      email: ''
    };
  }

  agregarPasajero(tipo: string): void {
    this.pasajeros.push(this.nuevoPasajero(tipo));
  }

  contarAdultos(): number {
  return this.pasajeros.filter(p => p.tipo === 'Adulto').length;
}

  reservar(): void {
    const erroresFrontend = [
      ...this.validarFormulario(),
      ...this.validarFechas(),
      ...this.validarDocumentosRepetidos()
    ];

    this.errores = [];
    this.erroresCampos = {};

    if (erroresFrontend.length > 0) {
      this.errores = [...erroresFrontend];
      return;
    }

    const reserva = {
      vueloId: this.vueloId,
      pasajeros: this.pasajeros
    };

    this.reservaService.crearReserva(reserva).subscribe({
      next: () => {
        this.errores = [];
        this.mostrarModal = true;
        this.cdr.detectChanges();
        this.resetFormulario();
      },
      error: (err: HttpErrorResponse) => {
        console.log('ERROR BACKEND:', err);

        const erroresBackend = this.extraerErrores(err);

        this.errores = [];

        this.errores = [...erroresBackend];

        this.mapearErroresBackendACampos(erroresBackend);

        this.cdr.detectChanges();

        console.log('ERRORES PINTADOS:', this.errores);
      }
    });
  }

  private extraerErrores(err: HttpErrorResponse): string[] {
    const body = err?.error;

    if (Array.isArray(body)) {
      return body.map(e => String(e));
    }

    if (typeof body === 'string') {
      const texto = body.trim();

      if (!texto) {
        return ['Error del servidor'];
      }

      try {
        const parsed = JSON.parse(texto);
        if (Array.isArray(parsed)) {
          return parsed.map(e => String(e));
        }
        if (parsed?.message) {
          return [String(parsed.message)];
        }
        return [texto];
      } catch {
        return [texto];
      }
    }

    if (body && typeof body === 'object') {
      if (Array.isArray((body as any).errors)) {
        return (body as any).errors.map((e: any) => String(e));
      }

      if ((body as any).message) {
        return [String((body as any).message)];
      }

      return Object.values(body).map(v => String(v));
    }

    if (err.message) {
      return [err.message];
    }

    return ['Error del servidor'];
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.router.navigate(['/'], { replaceUrl: true });
  }

  resetFormulario(): void {
    this.pasajeros = [this.nuevoPasajero('Adulto')];
  }

  validarFechas(): string[] {
    const hoy = new Date();
    const errores: string[] = [];

    this.pasajeros.forEach((p, index) => {
      if (!p.fechaNacimiento) {
        errores.push(`Pasajero ${index + 1}: fecha obligatoria`);
        return;
      }

      const fecha = new Date(p.fechaNacimiento);

      if (fecha > hoy) {
        errores.push(`Pasajero ${index + 1}: fecha no puede ser futura`);
        return;
      }

      let edad = hoy.getFullYear() - fecha.getFullYear();
      const mes = hoy.getMonth() - fecha.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }

      if (p.tipo === 'Adulto' && edad < 18) {
        errores.push(`Pasajero ${index + 1}: debe ser mayor de edad`);
      }

      if (p.tipo === 'Niño' && edad >= 18) {
        errores.push(`Pasajero ${index + 1}: debe ser menor de edad`);
      }
    });

    return errores;
  }

  validarFormulario(): string[] {
    const errores: string[] = [];

    this.pasajeros.forEach((p, index) => {
      if (!p.nombre?.trim()) {
        errores.push(`Pasajero ${index + 1}: nombre obligatorio`);
      }

      if (!p.documento?.trim()) {
        errores.push(`Pasajero ${index + 1}: documento obligatorio`);
      }

      if (!p.email?.trim()) {
        errores.push(`Pasajero ${index + 1}: email obligatorio`);
      } else if (!this.validarEmail(p.email)) {
        errores.push(`Pasajero ${index + 1}: email inválido`);
      }
    });

    return errores;
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onReservarClick(event: Event) {
  event.preventDefault();

  setTimeout(() => {
    this.reservar();
  });
}

mapearErroresBackendACampos(erroresBackend: string[]): void {
  erroresBackend.forEach(mensaje => {

    const match = mensaje.match(/\d+/);

    if (match) {
      const documento = match[0];

      this.pasajeros.forEach((p, index) => {
        if (p.documento === documento) {
          this.erroresCampos[`documento${index}`] =
            `Pasajero ${index + 1}: documento ya registrado`;
        }
      });

    } else {

      this.pasajeros.forEach((p, index) => {
        this.erroresCampos[`documento${index}`] =
          `Documento posiblemente ya registrado en el vuelo`;
      });
    }

  });
}

validarDocumentosRepetidos(): string[] {
  const errores: string[] = [];
  const mapa = new Map<string, number[]>();

  this.pasajeros.forEach((p, index) => {
    const doc = p.documento?.trim();

    if (!doc) return;

    if (!mapa.has(doc)) {
      mapa.set(doc, []);
    }

    mapa.get(doc)!.push(index);
  });

  mapa.forEach((indices, doc) => {
    if (indices.length > 1) {
      indices.forEach(i => {
        const mensaje = `Documento repetido`;
        errores.push(`Pasajero ${i + 1}: documento duplicado`);

        this.erroresCampos[`documento${i}`] = mensaje;
      });
    }
  });

  return errores;
}

eliminarPasajero(index: number): void {
  this.pasajeros.splice(index, 1);
}
}