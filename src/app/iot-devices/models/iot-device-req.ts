import { DeviceType } from "./iot-device";

export interface IotDeviceReq {
    macAddress: string;
    types: DeviceType[];
}