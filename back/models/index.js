import sequelize from '../config/db.js';
import Turno from './Turno.js';
import Alumno from './Alumno.js';
import Agujereadora from './Agujereadora.js';

// 🔸 Un alumno puede tener muchos turnos
Alumno.hasMany(Turno, {
  foreignKey: 'alumnoId',
  onDelete: 'CASCADE',
});
Turno.belongsTo(Alumno, {
  foreignKey: 'alumnoId',
});

// 🔸 Una agujereadora puede tener muchos turnos
Agujereadora.hasMany(Turno, {
  foreignKey: 'agujereadoraId',
  onDelete: 'SET NULL',
});
Turno.belongsTo(Agujereadora, {
  foreignKey: 'agujereadoraId',
});

export { sequelize, Turno, Alumno, Agujereadora };
