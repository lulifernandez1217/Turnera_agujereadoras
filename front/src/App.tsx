import { useState, useEffect } from "react";
import CalendarView from "./componentes/CalendarView";
import MachineList from "./componentes/MachineList";
import { sampleEvents } from "./Data/SampleEvents";
import type { BookingEvent, Machine } from "./types";

function replacer(key: string, value: any) {
  if (value instanceof Date)
    return { __type: "Date", value: value.toISOString() };
  return value;
}

function reviver(key: string, value: any) {
  if (value && value.__type === "Date") return new Date(value.value);
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
        </aside>

        <section className="calendar-area">
          <CalendarView
            events={events}
            machines={machines}
            onAdd={addEvent}
            onUpdate={updateEvent}
            onDelete={deleteEvent}
          />
        </section>
      </main>
    </div>
  );
}
