import { Component, ElementRef, inject, input, output, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAP_SERVICE, Coordinates } from '../../../interfaces/map-contract.interface';

@Component({
  selector: 'app-map-view',
  standalone: true,
  template: `<div #mapContainer class="size-full"></div>`,
  styles: [`:host { display: block; width: 100%; height: 100%; }`]
})
export class MapView implements AfterViewInit, OnDestroy {
  mapService = inject(MAP_SERVICE);

  center = input.required<Coordinates>();
  zoom = input.required<number>();
  mapClick = output<Coordinates>();
  zoomChanged = output<number>();

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  async ngAfterViewInit() {
    await this.mapService.initMap({
      container: this.mapContainer().nativeElement,
      center: (await this.mapService.getUserLocation()) ?? this.center(),
      zoom: this.zoom(),
    });

    this.mapService.onMapClick((coords) => this.mapClick.emit(coords));
    this.mapService.onZoomChanged((zoom: number) => this.zoomChanged.emit(zoom));
  }


  ngOnDestroy() {
    this.mapService.destroy();
  }
}
