import { useState, useEffect } from 'react';
import axios from 'axios';
import { type BookingEvent } from '../types';

// Tipo que viene del backend (con todos los campos)
interface BookingFromAPI {
    id: string;
    
    alumnoId: string;
    agujereadoraId: string;
    fechaInicio: string;
    fechaFin: string;
    titulo: string;
    updatedAt: string;
    createdAt: string;
}

interface UseFetchBookingsReturn {
  bookings: BookingEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchBookings = (): UseFetchBookingsReturn => {
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<BookingFromAPI[]>('http://localhost:3000/api/turnos');
      
      // Mapear solo los campos que necesitamos
      const mappedBookings: BookingEvent[] = response.data.map((turno: BookingFromAPI) => ({
        id: turno.id.toString(),
        studentId: turno.alumnoId,
        machineId: turno.agujereadoraId,
        start: new Date(turno.fechaInicio),
        end: new Date(turno.fechaFin),
        title: turno.titulo,
      }));
      
      setBookings(mappedBookings);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.message}`
        : 'Error desconocido al cargar turnos';
      setError(errorMessage);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return { bookings, loading, error, refetch: fetchBookings };
};