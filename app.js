import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./server/routes/index.js";
import { ValidationError } from "./server/helpers/customErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "/client/dist/");

// const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
// const routes = require("./server/routes");

// Serve static files from the client app
app.use(express.static(staticPath));

// Use JSON
app.use(express.json());

// api routes
app.use(routes);

// serve client routes as fall back
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

// Catch-all error handler
app.use((err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(400);
  } else {
    res.status(500);
  }
  res.json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
