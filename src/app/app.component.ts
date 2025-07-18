import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './shared/layout/service/app.layout.service';
import { AppLayoutModule } from './shared/layout/app.layout.module';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, AppLayoutModule, ToastModule],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  private primengConfig: PrimeNGConfig = inject(PrimeNGConfig);
  private layoutService: LayoutService = inject(LayoutService);

  ngOnInit(): void {
    this.primengConfig.ripple = true; //enables core ripple functionality
    document.documentElement.style.fontSize = '14px';

    //optional configuration with the default configuration
    this.layoutService.config = {
      ripple: false, //toggles ripple on and off
      inputStyle: 'outlined', //default style for input elements
      menuMode: 'static', //layout mode of the menu, valid values are "static" and "overlay"
      colorScheme: 'light', //color scheme of the template, valid values are "light" and "dark"
      theme: 'tailwind-light', //default component theme for PrimeNG
      scale: 12, //size of the body font size to scale the whole application
    };
  }
}
