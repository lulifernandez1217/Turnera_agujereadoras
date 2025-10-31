// config/db.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('db', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

try {
  await sequelize.authenticate();
  console.log('✅ Conexión a la base exitosa');
} catch (err) {
  console.error('❌ Error al conectar con la base:', err);
}

export default sequelize;
