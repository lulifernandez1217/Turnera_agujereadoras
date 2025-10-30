import React, { useState, useMemo } from "react";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "../Lib/Localizer";
import type { BookingEvent, Machine } from "../types";
import BookingModal from "./BookingModal";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Props {
  events: BookingEvent[];
  machines: Machine[];
  onAdd: (e: BookingEvent) => void;
  onUpdate: (e: BookingEvent) => void;
  onDelete: (id: string) => void;
}

const CalendarView: React.FC<Props> = ({
  events,
  machines,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<BookingEvent> | null>(null);

  const mappedEvents = useMemo(
    () =>
      events.map((e) => ({
        ...e,
        title: `${e.title} — ${e.user}`,
      })),
    [events]
  );

  const handleSelectSlot = (slot: any) => {
    setEditing({
      start: slot.start,
      end: slot.end,
      title: "",
      user: "",
      machineId: "",
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event: BookingEvent) => {
    setEditing(event);
    setModalOpen(true);
  };

  const handleSave = (evt: BookingEvent) => {
    const exists = events.find((e) => e.id === evt.id);
    exists ? onUpdate(evt) : onAdd(evt);
  };

  const eventStyleGetter = (event: BookingEvent) => {
    const machine = machines.find((m) => m.id === event.machineId);
    const color = machine ? machine.color : "#1E88E5";
    return {
      style: {
        backgroundColor: color,
        color: "white",
        borderRadius: "6px",
        border: "0",
      },
    };
  };

  return (
    <div className="calendar-wrapper card">
      <Calendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView={Views.WEEK}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        eventPropGetter={eventStyleGetter}
        style={{ height: "75vh" }}
      />

      <BookingModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        machines={machines}
        onSave={handleSave}
        onDelete={onDelete}
      />
    </div>
  );
};

export default CalendarView;
