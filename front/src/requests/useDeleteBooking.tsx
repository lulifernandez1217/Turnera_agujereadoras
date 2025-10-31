import { useState } from 'react';
import axios from 'axios';

interface UseDeleteBookingReturn {
  deleteBooking: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useDeleteBooking = (onSuccess?: () => void): UseDeleteBookingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBooking = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`http://localhost:3000/api/turnos/${id}`);
      
      // Si todo sale bien, llamar al callback de éxito (refetch)
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
        : 'Error desconocido al eliminar el turno';
      setError(errorMessage);
      console.error('Error deleting booking:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBooking, loading, error };
};