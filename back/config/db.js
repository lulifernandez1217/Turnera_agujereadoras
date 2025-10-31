// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
console.log(`⚙️  Cargando configuración para entorno: ${env}`);
const db_url = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5432/db';
console.log(db_url);

const sequelize = new Sequelize(
  db_url,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: env === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    },
    logging: env === 'development' ? console.log : false
  }
);

try {
  await sequelize.authenticate();
  console.log('✅ Conexión a la base exitosa');
} catch (err) {
  console.error('❌ Error al conectar con la base:', err);
}

export default sequelize;