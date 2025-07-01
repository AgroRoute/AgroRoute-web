import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { ClientService } from '../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Client } from '../../models/client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientReq } from '../../models/client-req';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ConfirmDialogModule,
    SharedModule,
    DataViewModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    DateFormatPipe
  ],
  providers: [ConfirmationService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  private _clientService = inject(ClientService);
  private _messageService = inject(MessageService);
  private _confirmationService = inject(ConfirmationService);

  clients = signal<Client[]>([]);
  selectedClient: Client | null = null;
  newClient: ClientReq = {} as ClientReq;
  isLoading = true;
  clientDialog = false;
  editMode = false;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this._clientService.getAll().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching IoT devices:', err);
        this.isLoading = false;
      },
    });
  }

  onFilter(data: any, event: any): void {
    console.log('Filter event:', event);
  }

  openAddDialog(): void {
    this.editMode = false;
    this.newClient = {} as ClientReq;
    this.clientDialog = true;
  }

  addClient(): void {
    this.isLoading = true;
    this._clientService.create(this.newClient).subscribe({
      next: (client) => {
        this.clients.update((clients) => [...clients, client]);
        this.newClient = { } as ClientReq; // Reset newClient};
        this.clientDialog = false;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Cliente agregado',
          detail: `Cliente ${client.firstName} ${client.lastName} agregado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el Cliente.',
        });
      },
    });
  }

  openEditDialog(): void {
    if (this.selectedClient) {
      this.editMode = true;
      this.newClient = {
        firstName: this.selectedClient.firstName,
        lastName: this.selectedClient.lastName,
        email: this.selectedClient.email,
        phoneNumber: this.selectedClient.phoneNumber
      };
      this.clientDialog = true;
    }
  }

  contactClient(): void {
    if (this.selectedClient) {
      window.location.href = `mailto:${this.selectedClient.email}?subject=Información de AgroRoute`;
      this._messageService.add({
        severity: 'info',
        summary: 'Contacto',
        detail: `Abriendo cliente de correo para contactar a ${this.selectedClient.firstName} ${this.selectedClient.lastName}.`,
      });
    }
  }

  onClientSelect(event: any): void {
    this.selectedClient = event.data;
  }

  confirmDelete(id: string): void {
    this._confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este Cliente? Esta acción no se puede deshacer.',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteClient(id);
      }
    });
  }

  deleteClient(id: string): void {
    this.isLoading = true;
    this._clientService.delete(id).subscribe({
      next: () => {
        this.clients.update((clients) =>
          clients.filter((client) => client.id !== id)
        );
        this.selectedClient = null;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Cliente eliminado',
          detail: `Cliente con id ${id} fue eliminado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el Cliente.',
        });
      },
    });
  }

  updateClient(): void {
    if (!this.selectedClient) return;
    
    this.isLoading = true;
    this._clientService.update(this.selectedClient.id, this.newClient).subscribe({
      next: (updatedClient) => {
        this.clients.update((clients) => 
          clients.map((client) => client.id === updatedClient.id ? updatedClient : client)
        );
        this.selectedClient = updatedClient;
        this.clientDialog = false;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Cliente actualizado',
          detail: `Cliente ${updatedClient.firstName} ${updatedClient.lastName} actualizado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el Cliente.',
        });
      },
    });
  }
}
