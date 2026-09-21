import { Component, ElementRef, inject, input, output, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAP_SERVICE, Coordinates, MapOtherOptions } from '../../../interfaces/map-contract.interface';

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
  otherOptions = input<MapOtherOptions>();
  mapClick = output<Coordinates>();
  zoomChanged = output<number>();
  mapReady = output<void>();

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  async ngAfterViewInit() {
    await this.mapService.initMap({
      container: this.mapContainer().nativeElement,
      center: this.center(),
      zoom: this.zoom(),
      otherOptions: this.otherOptions()
    });

    this.mapReady.emit();

    this.mapService.onMapClick((coords) => this.mapClick.emit(coords));
    this.mapService.onZoomChanged((zoom: number) => this.zoomChanged.emit(zoom));
  }


  ngOnDestroy() {
    this.mapService.destroy();
  }
}
