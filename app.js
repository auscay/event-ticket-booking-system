import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./db/index.js";
import eventRouter from "./events/event.route.js"

const app = express();
dotenv.config();
testConnection();

// Middleware to parse JSON requests
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send('Welcome to the Home Page');
});

// Test API json response
app.get("/api/v1", (req, res) => {
  res.json({ message: "Hello from API server!" });
});

app.use("/api/v1", eventRouter)





export default app;