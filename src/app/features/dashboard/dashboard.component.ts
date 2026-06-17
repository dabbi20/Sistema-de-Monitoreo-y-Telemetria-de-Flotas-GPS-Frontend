import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as L from 'leaflet';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly vehicleService = inject(VehicleService);
  private pollingSubscription?: Subscription;

  private map?: L.Map;
  private markersLayer = L.layerGroup();
  private vehicleMarkers = new Map<string, L.CircleMarker>();

  vehicles: Vehicle[] = [];
  selectedVehicle?: Vehicle;
  lastUpdate = new Date();

  ngOnInit(): void {
    this.loadVehicles();

    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadVehicles();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
    this.map?.remove();
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

        this.updateMapMarkers();
      },
      error: (error) => {
        console.error('Error cargando vehículos', error);
      },
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.focusVehicleOnMap(vehicle);
  }

  closeSelectedVehicle(): void {
    this.selectedVehicle = undefined;
  }

  private initMap(): void {
    this.map = L.map('fleet-map', {
      center: [4.711, -74.0721],
      zoom: 12,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.updateMapMarkers();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  private updateMapMarkers(): void {
    if (!this.map) return;

    this.markersLayer.clearLayers();
    this.vehicleMarkers.clear();

    this.vehicles.forEach((vehicle) => {
      const marker = L.circleMarker([vehicle.last_lat, vehicle.last_lng], {
        radius: 10,
        color: this.getMarkerColor(vehicle.status),
        fillColor: this.getMarkerColor(vehicle.status),
        fillOpacity: 0.85,
        weight: 2,
      });

      marker.bindPopup(this.buildPopupContent(vehicle));

      marker.on('click', () => {
        this.selectedVehicle = vehicle;
      });

      marker.addTo(this.markersLayer);
      this.vehicleMarkers.set(vehicle.vehicle_id, marker);
    });
  }

  private focusVehicleOnMap(vehicle: Vehicle): void {
    if (!this.map) return;

    this.map.setView([vehicle.last_lat, vehicle.last_lng], 15, {
      animate: true,
      duration: 0.8,
    });

    const marker = this.vehicleMarkers.get(vehicle.vehicle_id);

    setTimeout(() => {
      marker?.openPopup();
    }, 300);
  }

  private buildPopupContent(vehicle: Vehicle): string {
    return `
      <div style="min-width: 160px">
        <strong>${vehicle.vehicle_id}</strong><br>
        <span>Estado: ${vehicle.status}</span><br>
        <span>Lat: ${vehicle.last_lat}</span><br>
        <span>Lng: ${vehicle.last_lng}</span>
      </div>
    `;
  }

  private getMarkerColor(status: string): string {
    if (status === 'EN_MOVIMIENTO') return '#10E6C3';
    if (status === 'DETENIDO') return '#FACC15';
    if (status === 'SIN_SENAL') return '#F87171';
    return '#F87171';
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