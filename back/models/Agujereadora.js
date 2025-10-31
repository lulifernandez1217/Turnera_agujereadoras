import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Agujereadora = sequelize.define('Agujereadora', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  laboratorio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

export default Agujereadora;
