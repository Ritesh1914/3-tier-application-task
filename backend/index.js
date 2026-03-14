const express = require("express");
const { Pool } = require("pg");
const client = require("prom-client");
const logger = require("./logger");
require("dotenv").config();

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Prometheus metrics
client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    endpoint: req.url
  });
  next();
});

// Home endpoint
app.get("/", (req, res) => {
  httpRequestCounter.inc({ method: "GET", route: "/", status: 200 });

  logger.info({
    message: "Homepage accessed",
    endpoint: "/"
  });

  res.send("Backend running 🚀");
});

// Database endpoint
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    httpRequestCounter.inc({ method: "GET", route: "/users", status: 200 });

    logger.info({
      message: "Users endpoint accessed",
      endpoint: "/users"
    });

    res.json(result.rows);
  } catch (error) {

    logger.error({
      message: "Database query failed",
      error: error.message
    });

    res.status(500).send("Database error");
  }
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(5000, () => {
  logger.info({
    message: "Server started",
    port: 5000
  });
});
