import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const WaitingList = sequelize.define('WaitingList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Event', 
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', 
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'waiting_lists',
  timestamps: true, // Add createdAt and updatedAt columns
});

export default WaitingList;
