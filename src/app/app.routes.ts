import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { VuelosComponent } from './pages/vuelos/vuelos';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vuelos', component: VuelosComponent,
    runGuardsAndResolvers: 'always'
  }
];