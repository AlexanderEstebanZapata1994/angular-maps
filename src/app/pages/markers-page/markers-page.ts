import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapMarkerClusterer } from '@angular/google-maps';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid'
import { JsonPipe } from '@angular/common';

const googlemapsApiKey = environment.API_KEY_MAPS;

interface Marker {
  id: string;
  position: Position;
  label?: string;
  draggable?: boolean,
  isActive: boolean
}

interface Position {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-markers-page',
  imports: [GoogleMap, MapAdvancedMarker, JsonPipe],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {

  apiLoaded = signal<boolean>(false);
  mapDiv = viewChild<ElementRef>('map')
  map = signal<google.maps.Map | null>(null)
  markers = signal<Marker[]>([]);

  ngOnInit() {
    this.loadGoogleMapsApi()
      .then(() => this.apiLoaded.set(true))
      .catch((err) => console.error('Google Maps failed to load', err));
  }

  async ngAfterViewInit() {
    this.map.set(this.mapDiv()?.nativeElement);
  }

  onMapReady(map: google.maps.Map) {
    map.addListener('click', (event: google.maps.MapMouseEvent) => { this.onMapClick(event) })

    this.map.set(map);
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    const coordinates: Position = {
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng()
    }

    const newMarker: Marker = {
      id: uuidv4(),
      position: coordinates,
      label: 'New Marker',
      draggable: false,
      isActive: false
    }

    this.markers.update(currentMarkers => [newMarker, ...currentMarkers])
    console.log(this.markers())
  }

  flyToMaker(latLng: Position) {
    if (!this.map()) return;

    this.map()!.setCenter(latLng)
  }

  private loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If the global 'google' object already exists, don't inject again
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googlemapsApiKey}&libraries=marker`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

  deleteMarkers() {
    this.markers.set([]);
  }

  addMarker() {
  }

  changeMarkers() {

  }

}
