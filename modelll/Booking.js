import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Event', 
      key: 'id',       // primary key in the Event table
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User', 
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bookings', // Specify the table name
  timestamps: true, // Enable timestamps if you want createdAt and updatedAt columns
});


export default Booking;