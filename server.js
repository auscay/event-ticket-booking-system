import app from "./app.js";

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});