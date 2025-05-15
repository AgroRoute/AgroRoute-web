import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LoginReq } from '../models/login-req';
import { RegisterReq } from '../models/register-req';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    }),
  };

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(req: LoginReq): Observable<void> {
    return this._http.post<void>(
      `${environment.serverBasePath}/auth/sign-in`,
      req
    );
  }

  register(req: RegisterReq): Observable<void> {
    return this._http.post<void>(
      `${environment.serverBasePath}/auth/sign-up`,
      req
    );
  }

  logout(): boolean {
    localStorage.removeItem('authToken');
    return true;
  }
}
