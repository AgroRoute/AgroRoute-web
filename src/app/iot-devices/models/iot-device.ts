export interface IotDevice {
  id: string;
  macAddress: string;
  status: DeviceStatus;
  types: Set<DeviceType>;
  usageStatus: DeviceUsageStatus;
  humidityValue: number | null;
  temperatureValue: number | null;
  createdAt: string;
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum DeviceUsageStatus {
  IN_USE = 'IN_USE',
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum DeviceType {
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR'
}

export const DeviceStatusLabel: Record<DeviceStatus, string> = {
  [DeviceStatus.ONLINE]: 'En línea',
  [DeviceStatus.OFFLINE]: 'Fuera de línea'
};

export const DeviceUsageStatusLabel: Record<DeviceUsageStatus, string> = {
  [DeviceUsageStatus.IN_USE]: 'En uso',
  [DeviceUsageStatus.AVAILABLE]: 'Disponible',
  [DeviceUsageStatus.RESERVED]: 'Reservado',
  [DeviceUsageStatus.OUT_OF_SERVICE]: 'Fuera de servicio'
};

export const DeviceTypeLabel: Record<DeviceType, string> = {
  [DeviceType.TEMPERATURE_SENSOR]: 'Sensor de temperatura',
  [DeviceType.HUMIDITY_SENSOR]: 'Sensor de humedad'
};

