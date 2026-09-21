import { Component, inject, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'
import { DecimalPipe, JsonPipe } from '@angular/common';
import { MapView } from '../../shared/components/map-view/map-view';
import { Coordinates, MAP_SERVICE } from '../../interfaces/map-contract.interface';
import { GoogleMapsAdapter } from '../../services/google-maps.adapter';
import { CustomSpinner } from '../../shared/components/custom-spinner/custom-spinner';


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
  imports: [MapView, CustomSpinner, JsonPipe, DecimalPipe],
  templateUrl: './markers-page.html',
  providers: [
    { provide: MAP_SERVICE, useClass: GoogleMapsAdapter }
  ]
})
export class MarkersPage {

  private mapService = inject(MAP_SERVICE);
  markers = signal<Marker[]>([]);
  mapLoaded = signal<boolean>(false)

  async ngOnInit() {
    const userCoords = await this.mapService.getUserLocation()
    if (userCoords) this.mapService.setCenter(userCoords);
  }
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

  onMapLoaded() {
    this.mapLoaded.set(true)
  }


  flyToMarker(coords: Coordinates) {
    this.mapService.setCenter(coords);
  }

  deleteMarker(markerId: string) {
    this.mapService.removeMarker(markerId)
    this.markers.set(this.markers().filter(marker => marker.id !== markerId));
  }

}
