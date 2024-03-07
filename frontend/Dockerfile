# Use the official Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (if present) to the working directory
COPY ["package*.json", "./"]

# Install dependencies specified in package.json
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Expose port 8000 to the outside world
EXPOSE 8000

# Specify the default command to run when the container starts
CMD ["npm", "run", "dev"]