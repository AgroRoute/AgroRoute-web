import { IotDevice } from '../../iot-devices/models/iot-device';
import { Location } from './location';

export interface Package {
  id: string;
  trackingNumber: string;
  status: PackageStatus;
  details: PackageDetails;
  origin: Location;
  destination: Location;
  iotDevices: IotDevice[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageDetails {
  weight: number;
  width: number;
  height: number;
  length: number;
  description?: string;
  fragile: boolean;
  requiresRefrigeration: boolean;
}

export enum PackageStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  LOST = 'LOST'
}

export const PackageStatusLabel: Record<PackageStatus, string> = {
  [PackageStatus.PENDING]: 'Pendiente',
  [PackageStatus.PICKED_UP]: 'Recogido',
  [PackageStatus.IN_TRANSIT]: 'En Tránsito',
  [PackageStatus.DELIVERED]: 'Entregado',
  [PackageStatus.RETURNED]: 'Devuelto',
  [PackageStatus.LOST]: 'Perdido'
};

export interface PackageCreateRequest {
  trackingNumber?: string;
  details: PackageDetails;
  originId: string;
  destinationId: string;
  iotDeviceIds?: string[];
}

export interface PackageUpdateRequest {
  status?: PackageStatus;
  details?: Partial<PackageDetails>;
  originId?: string;
  destinationId?: string;
  iotDeviceIds?: string[];
}
