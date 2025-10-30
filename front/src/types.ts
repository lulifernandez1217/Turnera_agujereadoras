export interface Machine {
  id: string;
  name: string;
  color: string;
}

export interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  user: string;
  machineId: string;
}
