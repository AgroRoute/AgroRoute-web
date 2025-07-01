import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-th-large',
            routerLink: ['/app/dashboard'],
          },
          {
            label: 'Dispositivos IoT',
            icon: 'pi pi-server',
            routerLink: ['/app/iot-devices'],
          },
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            routerLink: ['/app/clients'],
          },
          {
            label: 'Empleados',
            icon: 'pi pi-id-card',
            routerLink: ['/app/employees'],
          },
        ],
      },
      
    ];
  }
}
