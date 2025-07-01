import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { authGuard } from './security/guards/auth.guard';
import { LoginComponent } from './security/pages/login/login.component';
import { RegisterComponent } from './security/pages/register/register.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';
import { IotDevicesComponent } from './iot-devices/pages/iot-devices/iot-devices.component';
import { ClientsComponent } from './organization/pages/clients/clients.component';
import { EmployeesComponent } from './organization/pages/employees/employees.component';

export const routes: Routes = [
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'iot-devices',
        component: IotDevicesComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'employees',
        component: EmployeesComponent
      }
    ],
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
