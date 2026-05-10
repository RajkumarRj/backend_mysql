const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();
const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
});

async function initDB() {
  const connection = await pool.getConnection();

  await connection.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id INT AUTO_INCREMENT PRIMARY KEY ,
        task VARCHAR(255) NOT NULL
        completed BOOLEAN DEFAULT FALSE)
        `);

        connection.release();

        console.log("MYSQL table ready");
        
}
app.get("/todos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todos");
  res.json(rows);
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  await pool.query("INSERT INTO todos (task) VALUES (?)", [task]);
  res.status(201).send("Task added");
});

app.listen(process.env.PORT || 3000, () => {
    initDB();
  console.log("server is up and running on port 3000");
});
