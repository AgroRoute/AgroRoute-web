export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Point;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Point {
  latitude: number;
  longitude: number;
}

export interface LocationCreateRequest {
  name: string;
  address: string;
  coordinates: Point;
  description?: string;
}

export interface LocationUpdateRequest {
  name?: string;
  address?: string;
  coordinates?: Point;
  description?: string;
}
