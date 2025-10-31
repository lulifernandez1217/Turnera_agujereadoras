import type { BookingEvent } from "../types";

export const sampleEvents: BookingEvent[] = [
  {
    id: "e1",
    title: "Práctica — Agujereadora 1",
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    machineId: "M1",
    studentId: "Alumno A",
  },
  {
    id: "e2",
    title: "Práctica — Agujereadora 2",
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 30, 0, 0)),
    machineId: "M2",
    studentId: "Alumno B",
  },
];
