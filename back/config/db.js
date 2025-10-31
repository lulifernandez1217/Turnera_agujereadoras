// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5432/db',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

try {
  await sequelize.authenticate();
  console.log('✅ Conexión a la base exitosa');
} catch (err) {
  console.error('❌ Error al conectar con la base:', err);
}

export default sequelize;