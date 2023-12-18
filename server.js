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
const mqttClient = mqtt.connect("mqtt://172.17.88.190:1883/"); // Replace with your MQTT broker URL

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
  mqttClient.subscribe("application/66293ac8-9d09-45be-be78-adbe84fbb267/device/a81758fffe0aa834/event/up"); // Replace with your MQTT topic
  console.log("Connected to MQTT broker");
});

mqttClient.on("message", (topic, message) => {
  // Assuming the message is in JSON format
  const data = JSON.parse(message.toString());
  console.log(data);

  // Insert data into PostgreSQL database
  // Fill in
  let importantData = { 
    "devEui" : data.deviceInfo.devEui,
    "time" : data.time, 
    "temperature" : data.object.temperature,
    "humidity" : data.object.humidity, 
    "pressure" : data.object.pressure
  }

  pool.query(
    "INSERT INTO measurements (device_id, timestamp, temperature, humidity, pressure) VALUES ($1, $2, $3, $4, $5)",
    [data.deviceInfo.devEui, data.time, data.object.temperature, data.object.humidity, data.object.pressure],
    (err) => {
      if (err) {
        console.error("Error inserting data into the database", err);
      } else {
        console.log("Data inserted into PostgreSQL database:", importantData);
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`xServer is running on http://localhost:${port}`);
});
