import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [LoadingSpinnerComponent], // Exportar para que esté disponible en otros módulos
})
export class SharedModule {}