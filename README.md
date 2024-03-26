# Software for Lorawan nodes

Build for visualizing data send by Lorawan nodes. 

## Technologies Used:

- Containerization: Docker
- Backend: Node.js and express
- Frontend: React.js and Vite
- Database: Postgresql

## Features

- Select a specific node to open info page
- Infopage includes linechart, datapoints and calendar to change date.

## Requirements

- Docker
- MQTT broker url and topic

## Installation instructions

1. Clone the project:
   ```
   https://github.com/Juke2H/appserv-node-docker.git
   ```
2. Check and set environment variables:

    backend/.env:
    ```
    POSTGRES_USER=
    POSTGRES_HOST=
    POSTGRES_DB=
    POSTGRES_PASSWORD=
    POSTGRES_PORT=
    
    MQTT_TOPIC_I=
    MQTT_TOPIC_O=
    MQTT_TOPIC_PC=
    MQTT_URL=
    
    SERVER_PORT=
    SOCKET_IO_URL=
    SERVER_URL=
    FRONTEND_URL=
    ```
    frontend/.env:
    ```
    VITE_BACKEND_URL=
    ```
3. Navigate to the project directory:
   ```
   cd appserv-node-docker/
   ```
4. Start the application:
   ```
   docker compose up
   ```
5. Open a browser at
   ```
   http://localhost:8000
   ```
