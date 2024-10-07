import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Booking = sequelize.define(
  'Booking',
  {
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    numberOfTickets: DataTypes.INTEGER,
  },
  {
    tableName: 'bookings',
  }
);

Booking.associate = (models) => {
  Booking.belongsTo(models.Event, { foreignKey: 'eventId' });
  Booking.belongsTo(models.User, { foreignKey: 'userId' });
};

export default Booking;