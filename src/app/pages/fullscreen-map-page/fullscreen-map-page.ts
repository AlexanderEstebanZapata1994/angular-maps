import { AfterViewInit, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { environment } from '../../../environments/environment';


const googlemapsApiKey = environment.API_KEY_MAPS;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [GoogleMap, JsonPipe, DecimalPipe],
  templateUrl: './fullscreen-map-page.html'
})
export class FullscreenMapPage implements AfterViewInit {

  apiLoaded = signal<boolean>(false);
  mapDiv = viewChild<ElementRef>('map')
  map = signal<google.maps.Map | null>(null)
  zoom = signal<number | undefined>(12);
  coords = signal<google.maps.LatLngLiteral>({
    lat: 4.5413,
    lng: -75.6779,
  });
  center = computed(() => this.coords());

  ngOnInit() {
    this.loadGoogleMapsApi()
      .then(() => this.apiLoaded.set(true))
      .catch((err) => console.error('Google Maps failed to load', err));
  }

  ngAfterViewInit(): void {
    if (!this.mapDiv()?.nativeElement) return;
    this.map.set(this.mapDiv()?.nativeElement);
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


  moveEnd(newCenter: google.maps.LatLng | undefined) {
    this.coords.set({
      lat: newCenter?.lat() ?? 0,
      lng: newCenter?.lng() ?? 0
    });
  }
}
