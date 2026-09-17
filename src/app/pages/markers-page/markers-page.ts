import { AfterViewInit, Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapMarkerClusterer } from '@angular/google-maps';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid'
import { DecimalPipe, JsonPipe } from '@angular/common';
import { MapView } from '../../shared/components/navbar/map-view/map-view';
import { Coordinates, MAP_SERVICE } from '../../interfaces/map-contract.interface';
import { GoogleMapsAdapter } from '../../services/google-maps.adapter';


export interface Marker {
  id: string;
  position: Position;
  label?: string;
  draggable?: boolean,
  isActive: boolean
}

export interface Position {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-markers-page',
  imports: [MapView, JsonPipe, DecimalPipe],
  templateUrl: './markers-page.html',
  providers: [
    { provide: MAP_SERVICE, useClass: GoogleMapsAdapter }
  ]
})
export class MarkersPage {

  apiLoaded = signal(true)
  private mapService = inject(MAP_SERVICE);
  markers = signal<Marker[]>([]);

  onMapClick(coordinates: Coordinates) {
    const newMarker: Marker = {
      id: uuidv4(),
      position: coordinates,
      label: 'New Marker',
      draggable: false,
      isActive: false
    };
    this.markers.update(curr => [newMarker, ...curr]);
    this.mapService.addMarker(newMarker);
  }



  flyToMarker(coords: Coordinates) {
    this.mapService.setCenter(coords);
  }

}
