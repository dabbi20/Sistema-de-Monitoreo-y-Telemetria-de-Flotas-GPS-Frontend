import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { VehicleService } from '../../core/services/vehicle.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const vehicleServiceMock = {
    getVehicles: () => of([]),
    getEvents: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: VehicleService,
          useValue: vehicleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe formatear EN_MOVIMIENTO correctamente', () => {
    expect(component.formatStatus('EN_MOVIMIENTO')).toBe('En movimiento');
  });

  it('debe formatear DETENIDO correctamente', () => {
    expect(component.formatStatus('DETENIDO')).toBe('Detenido');
  });

  it('debe retornar icono para EN_MOVIMIENTO', () => {
    expect(component.getStatusIcon('EN_MOVIMIENTO')).toBe('🟢');
  });
});