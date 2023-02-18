import { Sequelize } from 'sequelize';
import useLogger from '../utils/useLogger';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'bg2d.db',
  logging: useLogger(),
});

db.sync();

export default db;
