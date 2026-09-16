import { AfterViewInit, Component, computed, signal, ViewChild } from '@angular/core';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { environment } from '../../../environments/environment';


const googlemapsApiKey = environment.API_KEY_MAPS;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [GoogleMap, JsonPipe, DecimalPipe],
  templateUrl: './fullscreen-map-page.html'
})
export class FullscreenMapPage {

  @ViewChild('map') googleMap!: google.maps.Map;
  apiLoaded = signal<boolean>(false);
  zoom = signal<number>(12);
  initialCoords = signal<google.maps.LatLngLiteral>({
    lat: 4.5413,
    lng: -75.6779,
  });
  center = computed(() => this.initialCoords());

  ngOnInit() {
    this.loadGoogleMapsApi()
      .then(() => this.apiLoaded.set(true))
      .catch((err) => console.error('Google Maps failed to load', err));
  }

  private loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If the global 'google' object already exists, don't inject again
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googlemapsApiKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

  onMapReady(map: google.maps.Map) {
    this.googleMap = map;
  }

  moveEnd(newCenter: google.maps.LatLng | undefined) {
    this.initialCoords.set({
      lat: newCenter?.lat() ?? 0,
      lng: newCenter?.lng() ?? 0
    });
  }
}
