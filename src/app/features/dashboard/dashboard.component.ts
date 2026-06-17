import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly vehicleService = inject(VehicleService);
  private pollingSubscription?: Subscription;

  vehicles: Vehicle[] = [];
  selectedVehicle?: Vehicle;
  lastUpdate = new Date();

  ngOnInit(): void {
    this.loadVehicles();

    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadVehicles();
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.lastUpdate = new Date();

        if (this.selectedVehicle) {
          this.selectedVehicle = vehicles.find(
            (vehicle) => vehicle.vehicle_id === this.selectedVehicle?.vehicle_id
          );
        }
      },
      error: (error) => {
        console.error('Error cargando vehículos', error);
      },
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
  }

  closeSelectedVehicle(): void {
    this.selectedVehicle = undefined;
  }

  get totalVehicles(): number {
    return this.vehicles.length;
  }

  get movingVehicles(): number {
    return this.vehicles.filter((v) => v.status === 'EN_MOVIMIENTO').length;
  }

  get stoppedVehicles(): number {
    return this.vehicles.filter((v) => v.status === 'DETENIDO').length;
  }

  get noSignalVehicles(): number {
    return this.vehicles.filter((v) => v.status === 'SIN_SENAL').length;
  }

  getStatusClass(status: string): string {
    if (status === 'EN_MOVIMIENTO') return 'badge-moving';
    if (status === 'DETENIDO') return 'badge-stopped';
    if (status === 'SIN_SENAL') return 'badge-offline';
    return 'badge-offline';
  }

  getDotClass(status: string): string {
    if (status === 'EN_MOVIMIENTO') return 'bg-[#10E6C3]';
    if (status === 'DETENIDO') return 'bg-yellow-400';
    if (status === 'SIN_SENAL') return 'bg-red-400';
    return 'bg-red-400';
  }

  getStatusTextClass(status: string): string {
    if (status === 'EN_MOVIMIENTO') return 'text-[#10E6C3]';
    if (status === 'DETENIDO') return 'text-yellow-400';
    if (status === 'SIN_SENAL') return 'text-red-400';
    return 'text-red-400';
  }
}