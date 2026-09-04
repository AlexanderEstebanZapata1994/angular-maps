import { Routes } from '@angular/router';
import { FullscreenMapPage } from './pages/fullscreen-map-page/fullscreen-map-page';
import { MarkersPage } from './pages/markers-page/markers-page';
import { HousesPage } from './pages/houses-page/houses-page';

export const routes: Routes = [
  {
    path: 'fullscreen',
    title: 'Fullscreen Map',
    component: FullscreenMapPage
  },
  {
    path: 'markers',
    title: 'Markers Map',
    component: MarkersPage
  },
  {
    path: 'houses',
    title: 'Houses Map',
    component: HousesPage
  },
  {
    path: '**',
    redirectTo: 'fullscreen'
  },
];
