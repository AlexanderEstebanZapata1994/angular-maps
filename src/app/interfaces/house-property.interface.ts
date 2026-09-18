import { Coordinates } from "./map-contract.interface";

export interface HouseProperty {
  id: string;
  name: string;
  description: string;
  price: number;
  lngLat: Coordinates;
  tags: string[];
}
