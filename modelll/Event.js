// models/event.js
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Event = sequelize.define(
    'Event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availableTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',  
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    },
    {
      tableName: 'events',  // Specify the table name
      timestamps: true,  // Enable createdAt and updatedAt timestamps
    }
  );

export default Event;
