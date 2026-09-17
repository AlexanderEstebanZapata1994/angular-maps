import { Component, ElementRef, inject, input, output, viewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAP_SERVICE, Coordinates } from '../../../../interfaces/map-contract.interface';

@Component({
  selector: 'app-map-view',
  standalone: true,
  template: `<div #mapContainer class="w-full h-full"></div>`,
  styles: [`:host { display: block; width: 100%; height: 100%; }`]
})
export class MapView implements AfterViewInit, OnDestroy {
  mapService = inject(MAP_SERVICE);

  center = input<Coordinates>({ lat: 4.5200, lng: -75.7103 });
  zoom = input<number>(16);
  mapClick = output<Coordinates>();

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  async ngAfterViewInit() {
    await this.mapService.initMap({
      container: this.mapContainer().nativeElement,
      center: (await this.mapService.getLocationUser()) ?? this.center(),
      zoom: this.zoom(),
    });

    this.mapService.onMapClick((coords) => this.mapClick.emit(coords));
  }
  ngOnDestroy() {
    this.mapService.destroy();
  }
}
