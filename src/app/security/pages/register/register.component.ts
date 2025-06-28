import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
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
export class RegisterComponent {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _fb: FormBuilder = inject(FormBuilder);
  private _messageService: MessageService = inject(MessageService);
  
  isLoading: boolean = false;

  form: FormGroup = this._fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    companyName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { confirmPassword, acceptTerms, ...credentials } =
        this.form.getRawValue();
      this._authService.register(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this._router.navigate(['/auth/login']);
          this._messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Ahora inicia sesión con tus credenciales',
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al registrar:', err);
          this._messageService.add({
            severity: 'error',
            summary: 'Error al registrar usuario',
            detail: err.error?.message || 'Ocurrió un error inesperado',
          });
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
