import express from 'express'
//import path from 'path'
import { sequelize, Turno, Alumno, Agujereadora } from './models/index.js';
import { Op } from 'sequelize';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Crear __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ahora puedes usar __dirname normalmente

const app = express()
const port = 3000
await sequelize.sync({ alter: true }); // ⚠️ CUIDADO: Borra todas las tablas y las recrea
app.use(express.json());
app.use(cors())


app.get('/healthcheck', (req, res) => {
  res.send('Hello World!')
})
await sequelize.sync({ alter: true }); // 'alter: true' ajusta tablas existentes sin borrarlas

app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.findAll(); // Devuelve todos los turnos
    res.json(turnos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo turnos' });
  }
});

app.post('/api/turnos', async (req, res) => {
  try {
    const { alumnoId, agujereadoraId, fechaInicio, fechaFin, titulo } = req.body;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validaciones básicas
    if (!alumnoId || !agujereadoraId || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (inicio >= fin) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la de fin' });
    }

    // ✅ NUEVO: Verificar que el alumno existe
    const alumno = await Alumno.findByPk(alumnoId);
    if (!alumno) {
      return res.status(404).json({ 
        error: `El alumno con ID ${alumnoId} no existe` 
      });
    }

    // ✅ NUEVO: Verificar que la agujereadora existe
    const agujereadora = await Agujereadora.findByPk(agujereadoraId);
    if (!agujereadora) {
      return res.status(404).json({ 
        error: `La agujereadora con ID ${agujereadoraId} no existe` 
      });
    }

    // 🕐 Margen permitido: 1 minuto (en milisegundos)
    const margen = 1 * 60 * 1000;

    // 🔍 Verificar superposición para la misma agujereadora
    const solapadoAgujereadora = await Turno.findOne({
      where: {
        agujereadoraId,
        [Op.and]: [
          { fechaInicio: { [Op.lt]: new Date(fin.getTime() - margen) } },
          { fechaFin: { [Op.gt]: new Date(inicio.getTime() + margen) } }
        ]
      }
    });

    if (solapadoAgujereadora) {
      return res.status(400).json({ error: 'La agujereadora ya está reservada en ese horario' });
    }

    // 🔍 Verificar superposición para el mismo alumno
    const solapadoAlumno = await Turno.findOne({
      where: {
        alumnoId,
        [Op.and]: [
          { fechaInicio: { [Op.lt]: new Date(fin.getTime() - margen) } },
          { fechaFin: { [Op.gt]: new Date(inicio.getTime() + margen) } }
        ]
      }
    });

    if (solapadoAlumno) {
      return res.status(400).json({ error: 'El alumno ya tiene un turno en ese horario' });
    }

    // ✅ Crear turno si no hay solapamientos
    const nuevoTurno = await Turno.create({
      alumnoId,
      agujereadoraId,
      fechaInicio,
      fechaFin,
      titulo
    });

    res.status(201).json(nuevoTurno);

  } catch (err) {
    console.error('Error completo:', err); // 👈 Más detalle en los logs
    res.status(500).json({ error: 'Error creando turno' });
  }
});

app.get('/api/agujereadoras', async (req, res) => {
    try {
        const agujereadoras = await Agujereadora.findAll(); // Devuelve todas las agujereadoras  
        res.json(agujereadoras);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo agujereadoras' });
    }
});

app.post('/api/agujereadoras', express.json(), async (req, res) => {
    try {
        const nuevaAgujereadora = await Agujereadora.create(req.body);
        res.status(201).json(nuevaAgujereadora);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creando agujereadora' });
    }
});

// realiza un endpoint que permita obtener la agujereadora de un alumno por su ID
app.get('/api/alumno/:id', async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id, {
            include: Turno,
        });
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(alumno);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo alumno' });
    }
});


app.get('/api/alumnos', async (req, res) => {
    try {
        const alumnos = await Alumno.findAll(); // Devuelve todos los alumnos  
        res.json(alumnos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo alumnos' });
    }
});

app.post('/api/alumnos', express.json(), async (req, res) => {
    try {
        const nuevoAlumno = await Alumno.create(req.body);
        res.status(201).json(nuevoAlumno);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creando alumno' });
    }
});

// DELETE alumno por ID
app.delete('/api/alumnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findByPk(id);

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    await alumno.destroy();
    res.json({ message: `Alumno con id ${id} eliminado correctamente.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando alumno' });
  }
});


// DELETE agujereadora por ID
app.delete('/api/agujereadoras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agujereadora = await Agujereadora.findByPk(id);

    if (!agujereadora) {
      return res.status(404).json({ error: 'Agujereadora no encontrada' });
    }

    await agujereadora.destroy();
    res.json({ message: `Agujereadora con id ${id} eliminada correctamente.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando agujereadora' });
  }
});


// DELETE turno por ID
app.delete('/api/turnos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findByPk(id);

    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.destroy();
    res.json({ message: `Turno con id ${id} eliminado correctamente.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando turno' });
  }
});


/**
 * Endpoints de React (comentado porque no hay frontend aun)
 */

// para servir los archivos estaticas de React
app.use(express.static(join(__dirname, '..', 'front', 'dist')));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, '..', 'front', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

