import { Sequelize } from "sequelize";
import CONFIG from "./config.js";

// Create a new Sequelize instance and connect to database
const sequelize = new Sequelize(CONFIG.database, CONFIG.user, CONFIG.password, {
    host: CONFIG.host,
    dialect: CONFIG.dialect
});

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to MySQL database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

export { sequelize, testConnection };

