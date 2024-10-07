import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
}, {
    tableName: "users"
});

User.associate = (models) => {
    User.hasMany(models.Event, { foreignKey: 'userId' });
    User.hasMany(models.Booking, { foreignKey: 'userId' });
};

export default User;