import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { TelemetryEvent } from '../../models/telemetry-event.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly vehiclesUrl = 'http://localhost:8082/vehicles';
  private readonly eventsUrl = 'http://localhost:8082/events';

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehiclesUrl);
  }

  getEvents(): Observable<TelemetryEvent[]> {
    return this.http.get<TelemetryEvent[]>(this.eventsUrl);
  }
}