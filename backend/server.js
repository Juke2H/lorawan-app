const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const cors = require('cors');
const { Pool } = require('pg');

// PostgreSQL connection pool
// Fill in
const pool = new Pool({
  user: "user",
  host: "postgres_riveria",
  database: "measurements",
  password: "password",
  port: 5432,
})

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.port || 3000;
// MQTT connection
// Fill in
const mqttClient = mqtt.connect("mqtt://mosquitto:1883/"); // Replace with your MQTT broker URL

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
  let importantData;
  
  if (data.deviceInfo.deviceProfileName == "Ulkolämpömittari") {
    importantData = { 
      "devEui" : data.deviceInfo.devEui,
      "time" : data.time, 
      "temperature" : data.object.temperature,
      "humidity" : data.object.humidity, 
      "pressure" : data.object.pressure
    };

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
  } else if (data.deviceInfo.deviceProfileName == "Sisälämpömittari") {
    importantData = { 
      "devEui" : data.deviceInfo.devEui,
      "time" : data.time, 
      "temperature" : data.object.temperature,
      "humidity" : data.object.humidity, 
      "waterleak" : data.object.waterleak
    };

    pool.query(
      "INSERT INTO measurements2 (device_id, timestamp, temperature, humidity, waterleak) VALUES ($1, $2, $3, $4, $5)",
      [data.deviceInfo.devEui, data.time, data.object.temperature, data.object.humidity, data.object.waterleak],
      (err) => {
        if (err) {
          console.error("Error inserting data into the database", err);
        } else {
          console.log("Data inserted into PostgreSQL database:", importantData);
        }
      }
    );
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Get Queries

const getOutsideMeasurementsByID = (request, response) => {
  const getQuery = 'SELECT * FROM measurements ORDER BY device_id ASC LIMIT 15'
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getInsideMeasurementsByID = (request, response) => {
  const getQuery = 'SELECT * FROM measurements2 ORDER BY device_id ASC LIMIT 15'
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOutsideMeasurementsByTime = (request, response) => {
  const getQuery = 'SELECT * FROM measurements ORDER BY timestamp ASC LIMIT 15'
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getInsideMeasurementsByTime = (request, response) => {
  const getQuery = 'SELECT * FROM measurements2 ORDER BY timestamp ASC LIMIT 15'
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLatestInsideMeasurement = (request, response) => {
  const getQuery = 'SELECT * FROM measurements2 ORDER BY id DESC LIMIT 1'
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

app.get('/', (request, response) => {
  response.json({ info: 'Hello' })
})
app.get('/getOutsideMeasurementsByID', getOutsideMeasurementsByID)
app.get('/getInsideMeasurementsByID', getInsideMeasurementsByID)
app.get('/getOutsideMeasurementsByTime', getOutsideMeasurementsByTime)
app.get('/getInsideMeasurementsByTime', getInsideMeasurementsByTime)
app.get('/getLatestInsideMeasurement', getLatestInsideMeasurement)