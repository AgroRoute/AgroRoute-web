import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { IotDevice } from '../models/iot-device';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IotDeviceService extends BaseService<IotDevice> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/iot-devices';

  updateStatus(id: string, status: string): Observable<void> {
    return this._http
      .put<void>(
        `${this.resourcePath()}/${id}/status?status=${encodeURIComponent(
          status
        )}`,
        {},
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
}
