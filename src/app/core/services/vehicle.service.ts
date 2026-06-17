import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly http = inject(HttpClient);
private readonly apiUrl = 'http://localhost:8082/vehicles';

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }
}