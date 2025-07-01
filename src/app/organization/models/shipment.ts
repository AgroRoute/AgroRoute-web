import { Client } from './client';
import { Employee } from './employee';
import { Location } from './location';
import { Package } from './package';

export interface Shipment {
  id: string;
  client: Client;
  driver?: Employee;
  packages: Package[];
  origin: Location;
  destination: Location;
  status: ShipmentStatus;
  scheduledDate: string;
  completedDate?: string;
  estimatedArrival?: string;
  trackingCode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED'
}

export const ShipmentStatusLabel: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'Pendiente',
  [ShipmentStatus.ASSIGNED]: 'Asignado',
  [ShipmentStatus.IN_TRANSIT]: 'En Tránsito',
  [ShipmentStatus.COMPLETED]: 'Completado',
  [ShipmentStatus.CANCELLED]: 'Cancelado',
  [ShipmentStatus.DELAYED]: 'Retrasado'
};

export interface ShipmentCreateRequest {
  clientId: string;
  driverId?: string;
  packageIds: string[];
  originId: string;
  destinationId: string;
  scheduledDate: string;
  estimatedArrival?: string;
  notes?: string;
}

export interface ShipmentUpdateRequest {
  clientId?: string;
  driverId?: string;
  packageIds?: string[];
  originId?: string;
  destinationId?: string;
  status?: ShipmentStatus;
  scheduledDate?: string;
  completedDate?: string;
  estimatedArrival?: string;
  notes?: string;
}
