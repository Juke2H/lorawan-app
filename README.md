# Software for Lorawan nodes

These are the database and frontend portions built on top of a ChirpStack LoRaWan network server.

## Built with:

- Containerization: Docker
- Backend: Node.js and Express
- Frontend: React.js and Vite
- Database: PostgreSQL

## Features

- Select a specific node to open info page
- Infopage includes chart, datapoints and calendar to change date.

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
