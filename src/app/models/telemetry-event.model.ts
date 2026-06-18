export interface TelemetryEvent {
  description: string;
  vehicle_id: string;
  previous_status: string | null;
  new_status: string | null;
  event_type: string;
  event_time: string;
}