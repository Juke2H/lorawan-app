const express = require('express');
const { Pool } = require('pg');
const mqtt = require('mqtt');


const app = express();
const port = process.env.port || 3000;

// PostgreSQL connection pool
// Fill in
const pool = new Pool({
  user: "user",
  host: "postgres_riveria",
  database: "measurements",
  password: "password",
  port: 5432,
})

// MQTT connection
// Fill in
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
// Fill in
mqttClient.on("connect", () => {
  mqttClient.subscribe("your_topic"); // Replace with your MQTT topic
  console.log("Connected to MQTT broker");
});

mqttClient.on("message", (topic, message) => {
  // Assuming the message is in JSON format
  const data = JSON.parse(message.toString());
  console.log(data);

  // Insert data into PostgreSQL database
  // Fill in
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
