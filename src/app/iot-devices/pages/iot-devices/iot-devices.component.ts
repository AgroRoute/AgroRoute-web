import { Component, OnInit, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IotDevice,
  DeviceType,
  DeviceStatus,
  DeviceUsageStatus,
  DeviceStatusLabel,
  DeviceUsageStatusLabel,
  DeviceTypeLabel,
} from '../../models/iot-device';
import { IotDeviceReq } from '../../models/iot-device-req';
import { IotDeviceService } from '../../services/iot-device.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { BadgeModule } from 'primeng/badge';
import { SharedModule } from '../../../shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { EnumLabelPipe } from '../../../shared/pipes/enum-label.pipe';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-iot-devices',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    BadgeModule,
    SharedModule,
    ToastModule,
    DataViewModule,
    DividerModule,
    EnumLabelPipe,
    ConfirmDialogModule,
  ],
  templateUrl: './iot-devices.component.html',
  styleUrl: './iot-devices.component.css',
  providers: [ConfirmationService]
})
export class IotDevicesComponent implements OnInit {
  private _iotDeviceService = inject(IotDeviceService);
  private _messageService = inject(MessageService);
  private _confirmationService = inject(ConfirmationService);
  DeviceStatus = DeviceStatus;
  DeviceUsageStatus = DeviceUsageStatus;
  DeviceType = DeviceType;

  // Labels para el pipe enumLabel
  DeviceStatusLabel = DeviceStatusLabel;
  DeviceUsageStatusLabel = DeviceUsageStatusLabel;
  DeviceTypeLabel = DeviceTypeLabel;

  iotDevices = signal<IotDevice[]>([]);
  newDevice: IotDeviceReq = { macAddress: '', types: [] };
  deviceTypes = Object.values(DeviceType);
  deviceTypeOptions = Object.keys(DeviceType).map((key) => ({
    label: DeviceTypeLabel[key as keyof typeof DeviceType],
    value: key,
  }));

  isLoading = true;
  deviceDialog = false;
  selectedDeviceDialog = false;
  selectedDevice: IotDevice | null = null;
  
  now = new Date();

  ngOnInit(): void {
    this._iotDeviceService.getAll().subscribe({
      next: (data) => {
        this.iotDevices.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching IoT devices:', err);
        this.isLoading = false;
      },
    });
  }

  openAddDialog(): void {
    this.deviceDialog = true;
  }

  onFilter(dv: any, event: any): void {
    dv.filter(event.target.value);
  }

  getDeviceTypeLabel(type: string | { label: string; value: string }): string {
    const value = typeof type === 'string' ? type : type.value;
    const found = this.deviceTypeOptions.find((opt) => opt.value === value);
    return found ? found.label : value;
  }

  addDevice(): void {
    this.isLoading = true;
    this._iotDeviceService.create(this.newDevice).subscribe({
      next: (device) => {
        this.iotDevices.update((devices) => [...devices, device]);
        this.newDevice = { macAddress: '', types: [] };
        this.deviceDialog = false;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Dispositivo agregado',
          detail: `Dispositivo ${device.macAddress} agregado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el dispositivo.',
        });
      },
    });
  }

  onDeviceSelect(event: any): void {
    this.selectedDevice = event.data;
  }

  confirmDelete(id: string): void {
    this._confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este dispositivo? Esta acción no se puede deshacer.',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteDevice(id);
      }
    });
  }

  deleteDevice(id: string): void {
    this.isLoading = true;
    this._iotDeviceService.delete(id).subscribe({
      next: () => {
        this.iotDevices.update((devices) =>
          devices.filter((device) => device.id !== id)
        );
        this.selectedDevice = null;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Dispositivo eliminado',
          detail: `Dispositivo con mac ${id} eliminado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el dispositivo.',
        });
      },
    });
  }

  isTypeSelected(typeValue: string): boolean {
    return this.newDevice.types.includes(typeValue as DeviceType);
  }

  toggleTypeSelection(typeValue: string): void {
    const type = typeValue as DeviceType;
    const index = this.newDevice.types.indexOf(type);

    if (index > -1) {
      this.newDevice.types.splice(index, 1);
    } else {
      this.newDevice.types.push(type);
    }
  }

  toggleDeviceStatus(id: string): void {
    if (!this.selectedDevice) return;

    const newStatus =
      this.selectedDevice.status === DeviceStatus.ONLINE
        ? DeviceStatus.OFFLINE
        : DeviceStatus.ONLINE;

    this.isLoading = true;
    this._iotDeviceService.updateStatus(id, newStatus).subscribe({
      next: () => {
        if (this.selectedDevice) {
          this.selectedDevice.status = newStatus;
          this.iotDevices.update((devices) =>
            devices.map((d) => {
              if (d.id === id) {
                return { ...d, status: newStatus };
              }
              return d;
            })
          );
        }

        this.isLoading = false;
        const message =
          newStatus === DeviceStatus.ONLINE
            ? 'Dispositivo conectado'
            : 'Dispositivo desconectado';

        this._messageService.add({
          severity: 'success',
          summary: 'Estado actualizado',
          detail: message,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado del dispositivo.',
        });
      },
    });
  }
}
