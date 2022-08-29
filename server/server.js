// Prepare .env variable file
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const server = express();

/**
 * Open database access
 */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Add dependencies to the server
 */
server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(bodyParser.urlencoded({ extended: true }));

/**
 * Insert an element inside of the database
 */
server.post("/api/insert", (req, res) => {
  const x = req.body.x;
  const y = req.body.y;

  const sqlInsert = "INSERT INTO population (x, y, hellos) VALUES (?, ?, 0)";

  db.query(sqlInsert, [x, y], (err, result) => {
    console.log(err);
    var test = { id: result.insertId, x: x, y: y };
    res.send(test);
  });
});

/**
 * Get the data from the database
 */
server.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM " + process.env.DB_NAME + ".population";

  db.query(sqlGet, (err, result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * Clears the database
 */
server.post("/api/reset", (req, res) => {
  const sqlReset = "DELETE FROM " + process.env.DB_NAME + ".population";

  db.query(sqlReset, (err, result) => {
    console.log(err);
    res.send(result);
  });
});

/**
 * Modify the hello value of an element in the database
 */
server.post("/api/hello", (req, res) => {
  const id = req.body.id;

  const sqlUpdate = "UPDATE population SET hellos = hellos + 1 WHERE id = ?";

  db.query(sqlUpdate, [id], (err, result) => {
    console.log(err);
    res.send(result);
  });
});

server.listen(process.env.PORT, () => {
  console.log("connected to host %i!", process.env.PORT);
});
