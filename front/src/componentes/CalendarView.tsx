import React, { useState, useMemo } from "react";
import { Calendar, Views, type SlotInfo } from "react-big-calendar";
import { localizer } from "../Lib/Localizer";
import type { BookingEvent, Machine, Student } from "../types";
import BookingModal from "./BookingModal";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Props {
  events: BookingEvent[];
  machines: Machine[];
  students: Student[];
  onAdd: (e: BookingEvent) => void;
  onUpdate: (e: BookingEvent) => void;
  onDelete: (id: string) => void;
}

const CalendarView: React.FC<Props> = ({
  events,
  machines,
  students,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<BookingEvent> | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const mappedEvents = useMemo(
    () =>
      events.map((e) => {
        const student = students.find((s) => s.id === e.studentId);
        return {
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
          title: `${e.title}${student ? " — " + student.name + " " + student.surname : ""}`,
        };
      }),
    [events, students]
  );

  const handleSelectSlot = (slot: SlotInfo) => {
    setEditing({
      start: slot.start,
      end: slot.end,
      title: "",
      studentId: "",
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
    if (exists) {
      onUpdate(evt);
    } else {
      onAdd(evt);
    }
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
        views={[Views.WEEK]}
        eventPropGetter={eventStyleGetter}
        style={{ height: "75vh" }}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
      />

      <BookingModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        machines={machines}
        students={students}
        onSave={handleSave}
        onDelete={onDelete}
      />
    </div>
  );
};

export default CalendarView;