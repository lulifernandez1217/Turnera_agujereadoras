export interface Machine {
  id: string;
  name: string;
  color: string;
}
export interface Student {
  id: string;
  name: string;
  surname: string;
}

export interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  machineId: string;
  studentId?: string;
}
