import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { VuelosComponent } from './pages/vuelos/vuelos';
import { ReservaComponent } from './pages/reserva/reserva';
import { MisVuelosComponent } from './pages/mis-vuelos/mis-vuelos';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vuelos', component: VuelosComponent,
    runGuardsAndResolvers: 'always'
  },
    { path: 'reserva', component: ReservaComponent,
    runGuardsAndResolvers: 'always'
  },
    { path: 'misVuelos', component: MisVuelosComponent,
    runGuardsAndResolvers: 'always'
  }
];