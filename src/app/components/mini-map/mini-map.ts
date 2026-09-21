import { Component, inject, input } from '@angular/core';
import { Coordinates, MAP_SERVICE, MapOtherOptions } from '../../interfaces/map-contract.interface';
import { GoogleMapsAdapter } from '../../services/google-maps.adapter';
import { MapView } from '../../shared/components/map-view/map-view';
import { Marker } from '../../pages/markers-page/markers-page';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-mini-map',
  imports: [MapView],
  templateUrl: './mini-map.html',
  providers: [{
    provide: MAP_SERVICE, useClass: GoogleMapsAdapter
  }]
})
export class MiniMap {

  private mapService = inject(MAP_SERVICE);
  height = input<string>('260px');
  width = input<string>('100%');
  coords = input.required<Coordinates>();
  miniMapOptions: MapOtherOptions = {
    scrollwheel: false,
    disableDefaultUI: true,
    doubleclickZoom: false,
    fullscreenControl: false,
    mapTypeControl: true,
    zoomControl: false,
    streetViewControl: false,
    keyboardShortcuts: false,
    scaleControl: false,
    rotateControl: false,
    gestureHandling: 'none'
  };

  ngAfterViewInit() {
    console.log("MiniMap init")
    this.mapService.setCenter(this.coords());
    console.log(this.coords());
    const newMarker: Marker = {
      id: uuid(),
      position: this.coords(),
      draggable: false,
      isActive: true,

    };
    this.mapService.addMarker(newMarker);
  }
}
