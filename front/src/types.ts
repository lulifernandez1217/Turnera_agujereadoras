export interface Machine {
  id: string;
  name: string;
  laboratorio: string; // laboratorio
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
