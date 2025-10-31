import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Student } from '../types';

// Tipo que viene del backend (con todos los campos)
interface StudentFromAPI {
  id: number;
  nombre: string;
  apellido: string;
  createdAt: string;
  updatedAt: string;
}

interface UseFetchStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchStudents = (): UseFetchStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<StudentFromAPI[]>('https://turnera-agujereadoras.onrender.com/api/alumnos');
      // const response = await axios.get<StudentFromAPI[]>('http://localhost:3000/api/alumnos');
      
      // Mapear solo los campos que necesitamos
      const mappedStudents: Student[] = response.data.map((alumno: StudentFromAPI) => ({
        id: alumno.id.toString(),
        name: alumno.nombre,
        surname: alumno.apellido,
      }));
      
      setStudents(mappedStudents);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.message}`
        : 'Error desconocido al cargar alumnos';
      setError(errorMessage);
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, refetch: fetchStudents };
};