# Software for Lorawan nodes

These are the database and frontend portions built on top of a ChirpStack LoRaWan network server.

## Features

- Select a specific node to open info page
- Infopage includes chart, datapoints and calendar to change date.

## Built with:

- Containerization: Docker
- Backend: Node.js and Express
- Frontend: React.js and Vite
- Database: PostgreSQL

## Requirements

- Docker
- Node.js
- A working LoRaWan network or, more likely, a way to publish MQTT messages (e.g. MQTT Explorer) to fake sensor data.

## Installation instructions

1. Clone the project:
   ```
   git@github.com:Juke2H/lorawan-app.git
   ```
2. Check and set environment variables to both .env.example files. Rename files to .env
    ```
3. Navigate to the project directory:
   ```
   cd lorawan-app/
   ```
4. Start the application:
   ```
   docker compose up
   ```
5. Open a browser at
   ```
   http://localhost:8000
   ```

## Usage

If there are datapoints in the database, usage of the web application is as simple as:

1. Select a sensor from the navigation bar
2. Select a date from the calendar

The chart will show available data for that date and has hoverable datapoints with tooltips.

# README still in-progress