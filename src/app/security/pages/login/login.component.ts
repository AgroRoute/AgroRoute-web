import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    RouterLink,
    SharedModule, 
  ],

  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .p-password input {
        width: 100%;
        padding: 1rem;
      }

      :host ::ng-deep .pi-eye {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }

      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  private _fb: FormBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _authService: AuthService = inject(AuthService);
  private _messageService: MessageService = inject(MessageService);

  isLoading: boolean = false;

  form: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const credentials = this.form.getRawValue();
      this._authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          localStorage.setItem('authToken', response.token);
          this._router.navigate(['/dashboard']);
          this._messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Bienvenido a AgroRoute',
          });
        },
        error: (err) => {
          this.isLoading = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Error al iniciar sesión',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          });
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
