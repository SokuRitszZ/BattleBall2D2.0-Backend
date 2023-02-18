import { DataTypes } from 'sequelize';
import db from '../db';

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '123456',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://sdfsdf.dev/100x100.png',
    },
  },
  {
    tableName: 'user',
    timestamps: false,
  }
);

export type typeUser = {
  id: string;
  name: string;
  avatar: string;
};

export default User;
