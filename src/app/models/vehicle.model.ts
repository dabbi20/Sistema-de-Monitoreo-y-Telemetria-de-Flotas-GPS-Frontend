export interface Vehicle {
  vehicle_id: string;
  last_lat: number;
  last_lng: number;
  last_seen: string;
  status: 'EN_MOVIMIENTO' | 'DETENIDO' | 'SIN_SENAL';
}