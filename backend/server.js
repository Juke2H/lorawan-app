const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mqtt = require("mqtt");
require("dotenv").config();
const { Pool } = require("pg");

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Create an Express application
const app = express();
const server = http.createServer(app); // Create HTTP server using Express app

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Enable CORS with specified options
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Initialize Socket.IO with HTTP server
const io = socketIo(server, {
  cors: corsOptions,
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to PostgreSQL database");
  }
});

// Connect to MQTT broker and subscribe to topics
const mqttClient = mqtt.connect(process.env.MQTT_URL);

// Use as many topics as necessary
mqttClient.on("connect", () => {
  mqttClient.subscribe(process.env.MQTT_TOPIC_I);
  mqttClient.subscribe(process.env.MQTT_TOPIC_O);
  mqttClient.subscribe(process.env.MQTT_TOPIC_PC);
  console.log("Connected to MQTT broker");
});

// Handle MQTT messages
mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Emit Socket.IO event to notify frontend about new data
    io.emit("dataUpdated");
    console.log(data);

  let importantData; // Declare variable to store important data extracted from MQTT message

  /* ChirpStack uses device profile templates to configure messages sent by devices under that template. For other Network Servers,
  this conditional will likely need to be something else. The devices profiles here are for the devices this application was originally built for. */
  
  // Check device profile name to determine data insertion table.
  if (data.deviceInfo.deviceProfileName == "IMBuildings People Counter") {
    // Extract important data for people counter devices
    importantData = {
      devEui: data.deviceInfo.devEui,
      time: data.rxInfo[0].nsTime,
      counter_a: data.object.counter_a,
      counter_b: data.object.counter_b,
      total_counter_a: data.object.total_counter_a,
      total_counter_b: data.object.total_counter_b
    };

    // Insert data into PostgreSQL database for people counter devices
    pool.query(
      "INSERT INTO measurements3 (device_id, timestamp, counter_a, counter_b, total_counter_a, total_counter_b) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        data.deviceInfo.devEui,
        data.rxInfo[0].nsTime,
        data.object.counter_a,
        data.object.counter_b,
        data.object.total_counter_a,
        data.object.total_counter_b
      ],
      (err) => {
        if (err) {
          console.error("Error inserting data into the database", err);
        } else {
          console.log("Data inserted into PostgreSQL database:", importantData);
        }
      }
    );
  } else if (data.deviceInfo.deviceProfileName == "Elsys ELT-2 HP outdoor sensor") {
    // Extract important data for outdoor temperature/humidity/pressure devices
    importantData = {
      devEui: data.deviceInfo.devEui,
      time: data.rxInfo[0].nsTime,
      temperature: data.object.temperature,
      humidity: data.object.humidity,
      pressure: data.object.pressure,
    };

    pool.query(
      "INSERT INTO measurements (device_id, timestamp, temperature, humidity, pressure) VALUES ($1, $2, $3, $4, $5)",
      [
        data.deviceInfo.devEui,
        data.rxInfo[0].nsTime,
        data.object.temperature,
        data.object.humidity,
        data.object.pressure,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting data into the database", err);
        } else {
          console.log("Data inserted into PostgreSQL database:", importantData);
        }
      }
    );
  } else if (data.deviceInfo.deviceProfileName == "Elsys EMS Lite indoor sensor") {
    // Extract important data for indoor temperature/humidity/waterleak devices
    importantData = {
      devEui: data.deviceInfo.devEui,
      time: data.rxInfo[0].nsTime,
      temperature: data.object.temperature,
      humidity: data.object.humidity,
      waterleak: data.object.waterleak,
    };

    pool.query(
      "INSERT INTO measurements2 (device_id, timestamp, temperature, humidity, waterleak) VALUES ($1, $2, $3, $4, $5)",
      [
        data.deviceInfo.devEui,
        data.rxInfo[0].nsTime,
        data.object.temperature,
        data.object.humidity,
        data.object.waterleak,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting data into the database", err);
        } else {
          console.log("Data inserted into PostgreSQL database:", importantData);
        }
      }
    );
  }
} catch (error) {
  console.error("Invalid JSON message:", message.toString());
  console.error("Error:", error);
}
});

// Define route handlers for retrieving measurements
const getOutsideMeasurementsByID = (request, response) => {
  const getQuery = "SELECT * FROM measurements ORDER BY device_id ASC LIMIT 1";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getInsideMeasurementsByID = (request, response) => {
  const getQuery = "SELECT * FROM measurements2 ORDER BY device_id ASC LIMIT 1";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOutsideMeasurementsByTime = (request, response) => {
  const getQuery = "SELECT * FROM measurements ORDER BY timestamp DESC LIMIT 5";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getInsideMeasurementsByTime = (request, response) => {
  const getQuery =
    "SELECT * FROM measurements2 ORDER BY timestamp DESC LIMIT 5";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getLatestInsideMeasurement = (request, response) => {
  const getQuery = "SELECT * FROM measurements2 ORDER BY id DESC LIMIT 1";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getLatestOutsideMeasurement = (request, response) => {
  const getQuery = "SELECT * FROM measurements ORDER BY id DESC LIMIT 1";
  pool.query(getQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const byDateInside = async (req, res) => {
  const requestedDate = req.query.date;

  if (!requestedDate) {
    return res.status(400).json({ error: "Date parameter is missing" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM measurements2 WHERE CAST(timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Helsinki' AS DATE) = $1",
      [requestedDate]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing database query:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const byDateOutside = async (req, res) => {
  const requestedDate = req.query.date;

  if (!requestedDate) {
    return res.status(400).json({ error: "Date parameter is missing" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM measurements WHERE CAST(timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Helsinki' AS DATE) = $1",
      [requestedDate]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing database query:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const byDatePC = async (req, res) => {
  const requestedDate = req.query.date;

  if (!requestedDate) {
    return res.status(400).json({ error: "Date parameter is missing" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM measurements3 WHERE CAST(timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Helsinki' AS DATE) = $1",
      [requestedDate]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing database query:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// Start the server
server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on ${process.env.SERVER_URL}${process.env.SERVER_PORT}`);
  console.log(`Socket.IO server is running on ${process.env.SOCKET_IO_URL}`);
});

// Define URLs
app.get("/", (request, response) => {
  response.json({ info: "Hello" });
});
app.get("/getOutsideMeasurementsByID", getOutsideMeasurementsByID);
app.get("/getInsideMeasurementsByID", getInsideMeasurementsByID);
app.get("/getOutsideMeasurementsByTime", getOutsideMeasurementsByTime);
app.get("/getInsideMeasurementsByTime", getInsideMeasurementsByTime);
app.get("/getLatestInsideMeasurement", getLatestInsideMeasurement);
app.get("/getLatestOutsideMeasurement", getLatestOutsideMeasurement);
app.get("/byDateInside", byDateInside);
app.get("/byDateOutside", byDateOutside);
app.get("/byDatePC", byDatePC);