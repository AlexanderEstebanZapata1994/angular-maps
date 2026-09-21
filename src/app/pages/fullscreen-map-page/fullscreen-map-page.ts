import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { Coordinates, MAP_SERVICE } from '../../interfaces/map-contract.interface';
import { GoogleMapsAdapter } from '../../services/google-maps.adapter';
import { MapView } from '../../shared/components/map-view/map-view';


@Component({
  selector: 'app-fullscreen-map-page',
  imports: [MapView, JsonPipe, DecimalPipe],
  templateUrl: './fullscreen-map-page.html',
  providers: [
    { provide: MAP_SERVICE, useClass: GoogleMapsAdapter }
  ]
})
export class FullscreenMapPage {

  private mapService = inject(MAP_SERVICE);
  controls = viewChild<ElementRef<HTMLDivElement>>('controls');

  apiLoaded = signal<boolean>(true);
  zoom = signal<number>(12);
  coords = signal<Coordinates>({ lat: 0, lng: 0 });
  center = computed(() => this.coords());

  coordsEffect = effect(async () => {
    const userCoords = await this.mapService.getUserLocation()
    if (userCoords) {
      this.coords.set(userCoords)
      this.mapService.setCenter(userCoords)
    }
  })

  zoomEffect = effect(() => {
    if (this.zoom() <= 0) return;
    this.mapService.setZoom(this.zoom());
  })


  onZoomChanged(zoom: number) {
    this.zoom.set(zoom)
  }

}
