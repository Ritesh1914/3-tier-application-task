const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");
require("dotenv").config();

const app = express();
app.use(express.json());

// Create PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Collect default metrics
client.collectDefaultMetrics();

// Custom request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

// Routes
app.get("/", (req, res) => {
  httpRequestCounter.inc();
  res.send("Backend running 🚀");
});

app.get("/users", async (req, res) => {
  httpRequestCounter.inc();
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(5000, () => console.log("Server running on port 5000"));
