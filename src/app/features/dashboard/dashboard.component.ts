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
        this.fitMapToVehicles();
      },
      error: (error) => {
        console.error('Error cargando vehículos', error);
      },
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.updateMapMarkers();
    this.focusVehicleOnMap(vehicle);
  }

  closeSelectedVehicle(): void {
    this.selectedVehicle = undefined;
    this.updateMapMarkers();
    this.fitMapToVehicles();
  }

  private initMap(): void {
    this.map = L.map('fleet-map', {
      center: [4.66, -74.08],
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.updateMapMarkers();

    setTimeout(() => {
      this.map?.invalidateSize();
      this.fitMapToVehicles();
    }, 150);
  }

  private updateMapMarkers(): void {
    if (!this.map) return;

    this.markersLayer.clearLayers();
    this.vehicleMarkers.clear();

    this.vehicles.forEach((vehicle) => {
      const isSelected = this.selectedVehicle?.vehicle_id === vehicle.vehicle_id;

      const marker = L.circleMarker([vehicle.last_lat, vehicle.last_lng], {
        radius: isSelected ? 14 : 10,
        color: isSelected ? '#FFFFFF' : this.getMarkerColor(vehicle.status),
        fillColor: this.getMarkerColor(vehicle.status),
        fillOpacity: isSelected ? 1 : 0.9,
        weight: isSelected ? 4 : 3,
      });

      marker.bindPopup(this.buildPopupContent(vehicle));

      marker.on('click', () => {
        this.selectedVehicle = vehicle;
        this.updateMapMarkers();

        setTimeout(() => {
          this.vehicleMarkers.get(vehicle.vehicle_id)?.openPopup();
        }, 100);
      });

      marker.addTo(this.markersLayer);
      this.vehicleMarkers.set(vehicle.vehicle_id, marker);
    });
  }

  private fitMapToVehicles(): void {
    if (!this.map || this.vehicles.length === 0 || this.selectedVehicle) return;

    const coordinates = this.vehicles.map(
      (vehicle) => [vehicle.last_lat, vehicle.last_lng] as [number, number]
    );

    const bounds = L.latLngBounds(coordinates);

    this.map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12,
    });
  }

  private focusVehicleOnMap(vehicle: Vehicle): void {
    if (!this.map) return;

    this.map.setView([vehicle.last_lat, vehicle.last_lng], 16, {
      animate: true,
      duration: 0.8,
    });

    setTimeout(() => {
      this.vehicleMarkers.get(vehicle.vehicle_id)?.openPopup();
    }, 350);
  }

private buildPopupContent(vehicle: Vehicle): string {
  return `
    <div style="
      min-width:220px;
      padding:4px;
      font-family:Inter,sans-serif;
    ">
      <h3 style="
        margin:0 0 8px 0;
        font-size:16px;
        font-weight:700;
      ">
        ${vehicle.vehicle_id}
      </h3>

      <div style="margin-bottom:8px;">
        ${this.getStatusIcon(vehicle.status)}
        <strong>${this.formatStatus(vehicle.status)}</strong>
      </div>

      <div>📍 ${vehicle.last_lat}</div>
      <div>📍 ${vehicle.last_lng}</div>

      <div style="margin-top:8px;color:#666;">
        🕒 ${this.getRelativeTime(vehicle.last_seen)}
      </div>
    </div>
  `;
}

  private getMarkerColor(status: string): string {
    if (status === 'EN_MOVIMIENTO') return '#10E6C3';
    if (status === 'DETENIDO') return '#FACC15';
    if (status === 'SIN_SENAL') return '#F87171';
    return '#F87171';
  }

  getStatusIcon(status: string): string {
    if (status === 'EN_MOVIMIENTO') return '🟢';
    if (status === 'DETENIDO') return '🟡';
    if (status === 'SIN_SENAL') return '🔴';
    return '🔴';
  }

  getRelativeTime(dateValue: string): string {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateValue).getTime()) / 1000
    );

    if (seconds < 5) return 'Ahora';
    if (seconds < 60) return `Hace ${seconds} segundos`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;

    const hours = Math.floor(minutes / 60);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  formatStatus(status: string): string {
    if (status === 'EN_MOVIMIENTO') return 'En movimiento';
    if (status === 'DETENIDO') return 'Detenido';
    if (status === 'SIN_SENAL') return 'Sin señal';
    return status;
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