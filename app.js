import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./db/index.js";

const app = express();
dotenv.config();
testConnection();

// Middleware to parse JSON requests
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send('Welcome to the Home Page');
});

// Test json response
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

export default app;