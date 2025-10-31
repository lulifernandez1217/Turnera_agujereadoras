import React, { useEffect, useState } from "react";
import type { BookingEvent, Machine ,Student} from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Partial<BookingEvent> | null;
  machines: Machine[];
  students: Student[];  
  onSave: (event: BookingEvent) => void;
  onDelete: (id: string) => void;
}

export const BookingModal: React.FC<Props> = ({
  open,
  onClose,
  initial,
  machines,
  students,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState<Partial<BookingEvent>>(initial || {});

  useEffect(() => setForm(initial || {}), [initial]);

  if (!open) return null;

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.machineId || !form.start || !form.end) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const newEvent: BookingEvent = {
      id: form.id || `evt-${Math.random().toString(36).slice(2, 9)}`,
      title: form.title,
      studentId: form.studentId || "",
      machineId: form.machineId,
      start: new Date(form.start),
      end: new Date(form.end),
    };

    onSave(newEvent);
    onClose();
  };

  const handleDelete = () => {
    if (form.id && confirm("¿Eliminar esta reserva?")) {
      onDelete(form.id);
      onClose();
    }
  };

  const formatInput = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="modal-backdrop">
      <div className="modal card">
        <h3>{form.id ? "Editar reserva" : "Nueva reserva"}</h3>
        <form onSubmit={handleSave} className="form">
          <label>
            Título
            <input name="title" value={form.title || ""} onChange={change} />
          </label>

          <label>
            Máquina
            <select
              name="machineId"
              value={form.machineId || ""}
              onChange={change}
            >
              <option value="">-- Selecciona --</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Alumno
           <select
              name="studentId"
              value={form.studentId || ""}
              onChange={change}
            >
             <option value="">-- Selecciona --</option>
              {students.map((s) => ( 
                <option key={s.id} value={s.id}>
                  {s.name} {s.surname}
                </option>
              ))}
             </select>
          </label>

          <label>
            Inicio
            <input
              type="datetime-local"
              name="start"
              value={formatInput(form.start)}
              onChange={change}
            />
          </label>

          <label>
            Fin
            <input
              type="datetime-local"
              name="end"
              value={formatInput(form.end)}
              onChange={change}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancelar
            </button>
            {form.id && (
              <button
                type="button"
                className="btn danger"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            )}
            <button type="submit" className="btn primary">
              {form.id ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
