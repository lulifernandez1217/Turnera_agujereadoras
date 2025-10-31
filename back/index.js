import express from 'express'
//import path from 'path'
import { sequelize, Turno, Alumno, Agujereadora } from './models/index.js';
import { Op } from 'sequelize';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express()
const port = 3000
await sequelize.sync({ alter: true }); 
app.use(express.json());
app.use(cors())


app.get('/healthcheck', (req, res) => {
  res.send('Hello World!')
})
await sequelize.sync({ alter: true });

app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await Turno.findAll(); 
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

    
    if (!alumnoId || !agujereadoraId || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (inicio >= fin) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la de fin' });
    }

   
    const alumno = await Alumno.findByPk(alumnoId);
    if (!alumno) {
      return res.status(404).json({ 
        error: `El alumno con ID ${alumnoId} no existe` 
      });
    }

    
    const agujereadora = await Agujereadora.findByPk(agujereadoraId);
    if (!agujereadora) {
      return res.status(404).json({ 
        error: `La agujereadora con ID ${agujereadoraId} no existe` 
      });
    }

    
    const margen = 1 * 60 * 1000;

   
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

    
    const nuevoTurno = await Turno.create({
      alumnoId,
      agujereadoraId,
      fechaInicio,
      fechaFin,
      titulo
    });

    res.status(201).json(nuevoTurno);

  } catch (err) {
    console.error('Error completo:', err); 
    res.status(500).json({ error: 'Error creando turno' });
  }
});

app.get('/api/agujereadoras', async (req, res) => {
    try {
        const agujereadoras = await Agujereadora.findAll();   
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

app.use(express.static(join(__dirname, '..', 'front', 'dist')));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, '..', 'front', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

