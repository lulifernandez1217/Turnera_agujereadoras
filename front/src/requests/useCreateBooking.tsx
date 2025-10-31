import { useState } from 'react';
import axios from 'axios';
import { type BookingEvent } from '../types';

// Tipo para enviar al backend
interface BookingToAPI {
  alumnoId: string;
  agujereadoraId: string;
  fechaInicio: string;
  fechaFin: string;
  titulo: string;
}

interface UseCreateBookingReturn {
  createBooking: (booking: BookingEvent) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useCreateBooking = (onSuccess?: () => void): UseCreateBookingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (booking: BookingEvent): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Mapear el BookingEvent al formato que espera el backend
      const bookingToSend: BookingToAPI = {
        alumnoId: booking.studentId ? booking.studentId:"" ,
        agujereadoraId: booking.machineId,
        fechaInicio: booking.start.toISOString(),
        fechaFin: booking.end.toISOString(),
        titulo: booking.title,
      };

      await axios.post('http://localhost:3000/api/turnos', bookingToSend);
      
      // Si todo sale bien, llamar al callback de éxito (refetch)
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
        : 'Error desconocido al crear el turno';
      setError(errorMessage);
      console.error('Error creating booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};