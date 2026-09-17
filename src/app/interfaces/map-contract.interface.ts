// src/app/interfaces/map-contract.interface.ts
import { InjectionToken } from '@angular/core';
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarkerOptions {
  id: string;
  position: Coordinates;
  title?: string;
  draggable?: boolean;
}

export interface MapInitOptions {
  container: HTMLElement;
  center: Coordinates;
  zoom: number;
}

export interface IMapService {
  initMap(options: MapInitOptions): Promise<void>;
  setCenter(coords: Coordinates): void;
  setZoom(zoom: number): void;
  addMarker(marker: MapMarkerOptions): void;
  removeMarker(markerId: string): void;
  clearMarkers(): void;
  onMapClick(callback: (coords: Coordinates) => void): void;
  onZoomChanged(callback: (zoom: number) => void): void;
  destroy(): void;
  getUserLocation(): Promise<Coordinates | null>
}

export const MAP_SERVICE = new InjectionToken<IMapService>('MAP_SERVICE');
