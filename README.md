# Software for Lorawan nodes

Build for visualizing data send by Lorawan nodes. 

## Technologies Used:

- Containerization: Docker
- Backend: Node.js and express
- Frontend: React.js and Vite
- Database: Postgresql

## Features

- Select a specific node to open info page
- Infopage includes chart, datapoints and calendar to change date.

## Requirements

- Docker
- MQTT broker url and topic

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
