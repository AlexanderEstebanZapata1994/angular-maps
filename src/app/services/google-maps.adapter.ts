// src/app/services/google-maps.adapter.ts
import { Injectable } from '@angular/core';
import { Coordinates, IMapService, MapInitOptions, MapMarkerOptions } from '../interfaces/map-contract.interface';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { environment } from '../../environments/environment.development';


@Injectable()
export class GoogleMapsAdapter implements IMapService {
  private map: google.maps.Map | null = null;
  private markersMap = new Map<string, google.maps.marker.AdvancedMarkerElement>();

  async initMap(options: MapInitOptions): Promise<void> {
    await this.loadSdk();

    this.map = new google.maps.Map(options.container, {
      center: options.center,
      zoom: options.zoom,
      mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
      colorScheme: google.maps.ColorScheme.FOLLOW_SYSTEM,
      ...options.otherOptions
    });
  }

  setCenter(coords: Coordinates): void {
    this.map?.setCenter(coords);
  }

  setZoom(zoom: number): void {
    this.map?.setZoom(zoom);
  }

  addMarker(options: MapMarkerOptions): void {
    if (!this.map) return;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: options.position,
      title: options.title,
      gmpDraggable: options.draggable ?? false,
    });
    this.markersMap.set(options.id, marker);
  }

  removeMarker(markerId: string): void {
    const marker = this.markersMap.get(markerId);
    if (marker) {
      marker.map = null;
      this.markersMap.delete(markerId);
    }
  }

  clearMarkers(): void {
    this.markersMap.forEach(marker => (marker.map = null));
    this.markersMap.clear();
  }

  onMapClick(callback: (coords: Coordinates) => void): void {
    this.map?.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        callback({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });
  }

  onZoomChanged(callback: (zoom: number) => void) {
    this.map?.addListener('zoom_changed', () => {
      callback(this.map?.getZoom() ?? 12);
    })
  }

  getUserLocation(): Promise<Coordinates> {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        }, error => reject(error))
      })
    }
    return Promise.reject('Geolocation not supported');
  }

  destroy(): void {
    this.clearMarkers();
    this.map = null;
  }

  private loadSdk(): Promise<void> {
    if (typeof google !== 'undefined' && google.maps) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.API_KEY_MAPS}&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }
}
