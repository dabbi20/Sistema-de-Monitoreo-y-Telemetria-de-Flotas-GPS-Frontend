import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe consultar GET /vehicles', () => {
    service.getVehicles().subscribe();

    const req = httpMock.expectOne(
      'http://localhost:8082/vehicles'
    );

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('debe consultar GET /events', () => {
    service.getEvents().subscribe();

    const req = httpMock.expectOne(
      'http://localhost:8082/events'
    );

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });
});