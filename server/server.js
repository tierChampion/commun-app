// Create your own environement in .env file
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const server = express();

// hide this in config?
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(bodyParser.urlencoded({ extended: true }));

server.post("/api/insert", (req, res) => {
  const x = req.body.x;
  const y = req.body.y;

  const sqlInsert = "INSERT INTO tree (x, y) VALUES (?, ?)";

  db.query(sqlInsert, [x, y], (err, result) => {
    console.log(err);
    var test = { id: result.insertId, x: x, y: y };
    res.send(test);
  });
});

server.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM " + process.env.DB_NAME + ".tree";

  db.query(sqlGet, (err, result) => {
    console.log(result);
    res.send(result);
  });
});

// probably not safe i guess?
server.post("/api/reset", (req, res) => {
  const sqlReset = "DELETE FROM " + process.env.DB_NAME + ".tree";

  db.query(sqlReset, (err, result) => {
    console.log(err);
    res.send(result);
  });
});

server.listen(process.env.PORT, () => {
  console.log("connected to host %i!", process.env.PORT);
});
