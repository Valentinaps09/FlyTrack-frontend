import { ChangeDetectorRef, Component } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-vuelos.html',
  styleUrl: './mis-vuelos.css',
})
export class MisVuelosComponent {

  documento = '';
  codigo = '';

  codigoEnviado = false;
  vuelos: any[] = [];

  loading = false;
  error = '';
  mensaje = '';

  constructor(
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef
  ) {}

  /* ============================= */
  /* 🔹 SOLICITAR CÓDIGO */
  /* ============================= */
  solicitarCodigo() {

    if (!this.documento || !this.documento.trim()) {
      this.error = 'Debes ingresar el número de documento';
      return;
    }

    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.vuelos = [];

    this.reservaService.solicitarCodigo(this.documento.trim())
      .subscribe({
        next: () => {
          this.codigoEnviado = true;
          this.mensaje = 'Código enviado a tu correo';
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.codigoEnviado = false;
          this.error = this.extraerMensajeError(err, 'No se pudo enviar el código');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ============================= */
  /* 🔹 VERIFICAR CÓDIGO */
  /* ============================= */
  verificarCodigo() {

    if (!this.codigo || !this.codigo.trim()) {
      this.error = 'Ingresa el código de verificación';
      return;
    }

    this.loading = true;
    this.error = '';
    this.mensaje = '';

    this.reservaService.verificarCodigo(this.documento.trim(), this.codigo.trim())
      .subscribe({
        next: (data: any[]) => {

          this.vuelos = (data || []).map((reserva: any) => ({
            codigo: reserva.codigoReserva || reserva.codigo,
            estado: reserva.estadoEtiqueta || reserva.estado,
            asiento: reserva.numeroAsiento,

            aerolinea: reserva.vuelo?.aerolinea,
            origen: reserva.vuelo?.origen,
            destino: reserva.vuelo?.destino,
            fecha: reserva.vuelo?.fechaSalida || reserva.vuelo?.fecha,
            hora: reserva.vuelo?.horaSalida || reserva.vuelo?.hora,
            imagen: reserva.vuelo?.imagen || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05'
          }));

          // 🔥 CLAVE: ocultar sección código
          this.codigoEnviado = false;
          this.codigo = '';
          this.mensaje = ''; // quitar mensaje éxito

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.vuelos = [];
          this.error = this.extraerMensajeError(err, 'Código incorrecto o expirado');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ============================= */
  /* 🔹 REENVIAR */
  /* ============================= */
  reenviarCodigo() {
    this.codigo = '';
    this.solicitarCodigo();
  }

  /* ============================= */
  /* 🔹 CERRAR (RESET TOTAL) */
  /* ============================= */
  cerrar() {
    this.documento = '';
    this.codigo = '';
    this.codigoEnviado = false;
    this.vuelos = [];
    this.error = '';
    this.mensaje = '';
  }

  private extraerMensajeError(err: any, mensajePorDefecto: string): string {
    if (typeof err?.error === 'string') return err.error;
    if (Array.isArray(err?.error)) return err.error[0];
    if (err?.error?.message) return err.error.message;
    return mensajePorDefecto;
  }
}