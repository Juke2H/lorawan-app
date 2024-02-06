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

1. Clone the project: `https://git@github.com:Juke2H/appserv-node-docker.git`
2. Navigate to the project directory: `cd appserv-node-docker/`
3. Start the application: `docker compose up`
4. Open a browser at `http://localhost:8000`