import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Alumno = sequelize.define('Alumno', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  
});

export default Alumno;