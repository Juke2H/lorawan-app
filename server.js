import express from "express";
import { json } from "body-parser";
import { Pool } from "pg";
import mqtt from "mqtt/*";

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

app.use(json()); // Enable JSON body parsing

// MQTT connection
const mqttClient = mqtt.connect("mqtt://mqtt.eclipse.org"); // Replace with your MQTT broker URL

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

// Handle MQTT messages
mqttClient.on("connect", () => {
  mqttClient.subscribe("your_topic"); // Replace with your MQTT topic
  console.log("Connected to MQTT broker");
});

mqttClient.on("message", (topic, message) => {
  // Assuming the message is in JSON format
  const data = JSON.parse(message.toString());

  // Insert data into PostgreSQL database
  pool.query(
    "INSERT INTO your_table (column1, column2) VALUES ($1, $2)",
    [data.value1, data.value2],
    (err) => {
      if (err) {
        console.error("Error inserting data into the database", err);
      } else {
        console.log("Data inserted into PostgreSQL database:", data);
      }
    }
  );
});

/*
// CREATE - Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
    (err, result) => {
      if (err) {
        console.error("Error inserting user", err);
        res.status(500).send("Error inserting user");
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

// READ - Get all users
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("Error retrieving users", err);
      res.status(500).send("Error retrieving users");
    } else {
      res.json(result.rows);
    }
  });
});

// UPDATE - Update user by ID
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user", err);
        res.status(500).send("Error updating user");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("User not found");
        } else {
          res.json(result.rows[0]);
        }
      }
    }
  );
});

// DELETE - Delete user by ID
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [userId],
    (err, result) => {
      if (err) {
        console.error("Error deleting user", err);
        res.status(500).send("Error deleting user");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("User not found");
        } else {
          res.json(result.rows[0]);
        }
      }
    }
  );
});
*/
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
