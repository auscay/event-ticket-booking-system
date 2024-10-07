// models/event.js
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Event = sequelize.define(
  'Event',
  {
    name: DataTypes.STRING,
    availableTickets: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  {
    tableName: 'events',
  }
);

Event.associate = (models) => {
  Event.belongsTo(models.User, { foreignKey: 'userId' });
  Event.hasMany(models.Booking, { foreignKey: 'eventId' });
};

export default Event;
