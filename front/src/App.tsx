import { useState, useEffect } from "react";
import CalendarView from "./componentes/CalendarView";
import MachineList from "./componentes/MachineList";
import { sampleEvents } from "./Data/SampleEvents";
import type { BookingEvent, Machine, Student} from "./types";
import StudentList from "./componentes/StudentList";

function replacer(_key: string, value: unknown) {
  if (value instanceof Date)
    return { __type: "Date", value: value.toISOString() };
  return value;
}

function reviver(_key: string, value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "__type" in (value as Record<string, unknown>)
  ) {
    const val = value as { __type: string; value: string };
    if (val.__type === "Date") {
      return new Date(val.value);
    }
  }
  return value;
}

export default function App() {
  const [events, setEvents] = useState<BookingEvent[]>(() => {
    try {
      const stored = localStorage.getItem("turnos");
      return stored ? JSON.parse(stored, reviver) : sampleEvents;
    } catch {
      return sampleEvents;
    }
  });

  const [machines] = useState<Machine[]>([
    { id: "M1", name: "Agujereadora 1", color: "#1E88E5" },
    { id: "M2", name: "Agujereadora 2", color: "#43A047" },
    { id: "M3", name: "Agujereadora 3", color: "#F4511E" },
  ]);

    const [students] = useState<Student[]>([
    { id: "12", name: "Juana", surname: "Rodriguez" },
    { id: "1", name: "Diego", surname: "Fernandez" },
    { id: "69", name: "Emiliano", surname: "Politano" },
  ]);

  useEffect(() => {
    localStorage.setItem("turnos", JSON.stringify(events, replacer));
  }, [events]);

  const addEvent = (e: BookingEvent) => setEvents((prev) => [...prev, e]);
  const updateEvent = (updated: BookingEvent) =>
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  const deleteEvent = (id: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Turnera — Agujereadoras</h1>
        <p className="sub">Reserva turnos para las máquinas de la escuela</p>
      </header>

      <main className="main-grid">
        <aside className="sidebar">
          <MachineList machines={machines} />
           <StudentList students={students} />
        </aside>

      

        <section className="calendar-area">
          <CalendarView
            events={events}
            machines={machines}
            students={students}
            onAdd={addEvent}
            onUpdate={updateEvent}
            onDelete={deleteEvent}
          />
        </section>
      </main>
    </div>
  );
}
