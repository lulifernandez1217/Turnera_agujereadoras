import CalendarView from "./componentes/CalendarView";
import MachineList from "./componentes/MachineList";
import type { BookingEvent } from "./types";
import StudentList from "./componentes/StudentList";
import { useFetchStudents } from "./requests/useFetchStudents";
import { useFetchMachines } from "./requests/useFetchMachines";
import { useFetchBookings } from "./requests/useFetchBookings";
import { useCreateBooking } from "./requests/useCreateBooking";
import { useDeleteBooking } from "./requests/useDeleteBooking";

export default function App() {
  const { bookings, loading: loadingBookings, error: errorBookings, refetch: refetchBookings } = useFetchBookings();
  const { machines, loading: loadingMachines, error: errorMachines, refetch: refetchMachines } = useFetchMachines();
  const { students, loading: loadingStudents, error: errorStudents, refetch: refetchStudents } = useFetchStudents();

  // Hooks para crear y eliminar (con refetch automático al éxito)
  const { createBooking, loading: creatingBooking, error: createError } = useCreateBooking(refetchBookings);
  const { deleteBooking, loading: deletingBooking, error: deleteError } = useDeleteBooking(refetchBookings);

  const handleAddEvent = async (e: BookingEvent) => {
    const success = await createBooking(e);
    if (success) {
      console.log('✅ Turno creado exitosamente');
    } else {
      console.error('❌ Error al crear turno');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const success = await deleteBooking(id);
    if (success) {
      console.log('✅ Turno eliminado exitosamente');
    } else {
      console.error('❌ Error al eliminar turno');
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Turnera — Agujereadoras</h1>
        <p className="sub">Reserva turnos para las máquinas de la escuela</p>
      </header>

      <main className="main-grid">
        <aside className="sidebar">
          {loadingMachines ? (
            <p>Cargando agujereadoras...</p>
          ) : errorMachines ? (
            <div>
              <p>Error al cargar agujereadoras: {errorMachines}</p>
              <button onClick={refetchMachines}>Reintentar</button>
            </div>
          ) : (
            <MachineList machines={machines} />
          )}

          {loadingStudents ? (
            <p>Cargando alumnos...</p>
          ) : errorStudents ? (
            <div>
              <p>Error al cargar alumnos: {errorStudents}</p>
              <button onClick={refetchStudents}>Reintentar</button>
            </div>
          ) : (
            <StudentList students={students} />
          )}

        
          {createError && (
            <div style={{ color: '#d32f2f', padding: '10px', marginTop: '10px' }}>
              ❌ {createError}
            </div>
          )}
          {deleteError && (
            <div style={{ color: '#d32f2f', padding: '10px', marginTop: '10px' }}>
              ❌ {deleteError}
            </div>
          )}

          
          {(creatingBooking || deletingBooking) && (
            <div style={{ padding: '10px', marginTop: '10px' }}>
              ⏳ {creatingBooking ? 'Creando turno...' : 'Eliminando turno...'}
            </div>
          )}
        </aside>

        <section className="calendar-area">
          {loadingBookings ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>⏳ Cargando turnos...</p>
            </div>
          ) : errorBookings ? (
            <div style={{ padding: '20px', color: '#d32f2f' }}>
              <p>❌ Error al cargar turnos: {errorBookings}</p>
              <button onClick={refetchBookings}>Reintentar</button>
            </div>
          ) : (
            <CalendarView
              events={bookings}
              machines={machines}
              students={students}
              onAdd={handleAddEvent}
              onUpdate={() => {}} // Por ahora vacío
              onDelete={handleDeleteEvent}
            />
          )}
        </section>
      </main>
    </div>
  );
}