import express from 'express'
// import path from 'path'
import { sequelize, Turno, Alumno, Agujereadora } from './models/index.js';

const app = express()
const port = 3000
await sequelize.sync({ alter: true }); // 'alter: true' ajusta tablas existentes sin borrarlas


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

app.post('/api/turnos', express.json(), async (req, res) => {
    try {
        const nuevoTurno = await Turno.create(req.body);
        res.status(201).json(nuevoTurno);
    }
    catch (err) {
        console.error(err);
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

/**
 * Endpoints de React (comentado porque no hay frontend aun)
 */

// para servir los archivos estaticas de React
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Para redirigir cualquier peticion que no sea un endpoint de la API a React
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})