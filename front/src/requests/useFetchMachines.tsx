import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Machine } from '../types';

// Tipo que viene del backend (con todos los campos)
interface MachineFromAPI {
  id: number;
  nombre: string;
  laboratorio: string;
  createdAt: string;
  updatedAt: string;
}

interface UseFetchMachinesReturn {
  machines: Machine[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchMachines = (): UseFetchMachinesReturn => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<MachineFromAPI[]>('http://localhost:3000/api/agujereadoras');
      
      // Mapear solo los campos que necesitamos
      const mappedMachines: Machine[] = response.data.map((agujereadora: MachineFromAPI) => ({
        id: agujereadora.id.toString(),
        name: agujereadora.nombre,
        laboratorio: agujereadora.laboratorio,
      }));
      
      setMachines(mappedMachines);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.message}`
        : 'Error desconocido al cargar agujereadoras';
      setError(errorMessage);
      console.error('Error fetching machines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return { machines, loading, error, refetch: fetchMachines };
};