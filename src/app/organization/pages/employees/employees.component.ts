import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { EmployeeService } from '../../services/employee.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Employee } from '../../models/employee';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeReq } from '../../models/employee-req';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-employees',
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
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  private _employeeService = inject(EmployeeService);
  private _messageService = inject(MessageService);
  private _confirmationService = inject(ConfirmationService);

  employees = signal<Employee[]>([]);
  selectedEmployee: Employee | null = null;
  newEmployee: EmployeeReq = {} as EmployeeReq;
  isLoading = true;
  employeeDialog = false;
  editMode = false;

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this._employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        this.isLoading = false;
      },
    });
  }

  onFilter(data: any, event: any): void {
    console.log('Filter event:', event);
  }

  openAddDialog(): void {
    this.editMode = false;
    this.newEmployee = {} as EmployeeReq;
    this.employeeDialog = true;
  }

  addEmployee(): void {
    this.isLoading = true;
    this._employeeService.create(this.newEmployee).subscribe({
      next: (employee) => {
        this.employees.update((employees) => [...employees, employee]);
        this.newEmployee = { } as EmployeeReq; // Reset newEmployee};
        this.employeeDialog = false;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Empleado agregado',
          detail: `Empleado ${employee.firstName} ${employee.lastName} agregado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el Empleado.',
        });
      },
    });
  }

  openEditDialog(): void {
    if (this.selectedEmployee) {
      this.editMode = true;
      this.newEmployee = {
        firstName: this.selectedEmployee.firstName,
        lastName: this.selectedEmployee.lastName,
        email: this.selectedEmployee.email,
        phoneNumber: this.selectedEmployee.phoneNumber
      };
      this.employeeDialog = true;
    }
  }

  contactEmployee(): void {
    if (this.selectedEmployee) {
      window.location.href = `mailto:${this.selectedEmployee.email}?subject=Información de AgroRoute`;
      this._messageService.add({
        severity: 'info',
        summary: 'Contacto',
        detail: `Abriendo cliente de correo para contactar a ${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}.`,
      });
    }
  }

  onEmployeeSelect(event: any): void {
    this.selectedEmployee = event.data;
  }

  confirmDelete(id: string): void {
    this._confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este Empleado? Esta acción no se puede deshacer.',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteEmployee(id);
      }
    });
  }

  deleteEmployee(id: string): void {
    this.isLoading = true;
    this._employeeService.delete(id).subscribe({
      next: () => {
        this.employees.update((employees) =>
          employees.filter((employee) => employee.id !== id)
        );
        this.selectedEmployee = null;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Empleado eliminado',
          detail: `Empleado con id ${id} fue eliminado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el Empleado.',
        });
      },
    });
  }

  updateEmployee(): void {
    if (!this.selectedEmployee) return;
    
    this.isLoading = true;
    this._employeeService.update(this.selectedEmployee.id, this.newEmployee).subscribe({
      next: (updatedEmployee) => {
        this.employees.update((employees) => 
          employees.map((employee) => employee.id === updatedEmployee.id ? updatedEmployee : employee)
        );
        this.selectedEmployee = updatedEmployee;
        this.employeeDialog = false;
        this.isLoading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Empleado actualizado',
          detail: `Empleado ${updatedEmployee.firstName} ${updatedEmployee.lastName} actualizado correctamente.`,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el Empleado.',
        });
      },
    });
  }
}
