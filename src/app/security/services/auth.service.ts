import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginReq } from '../models/login-req';
import { RegisterReq } from '../models/register-req';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _router = inject(Router);
  private _http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(req: LoginReq): Observable<any> {
    return this._http.post(
      `${environment.serverBasePath}/auth/sign-in`,
      req,
      this.httpOptions
    );
  }

  register(req: RegisterReq): Observable<any> {
    return this._http.post(
      `${environment.serverBasePath}/auth/sign-up`,
      req,
      this.httpOptions
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this._router.navigate(['/auth/login']);
  }
}
