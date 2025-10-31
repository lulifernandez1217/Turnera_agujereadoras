import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Turno = sequelize.define('Turno', {
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agujereadoraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  
});

export default Turno;
