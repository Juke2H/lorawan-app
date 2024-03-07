# Use the official Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Set the environment variable NODE_ENV to development
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (if present) to the working directory
COPY ["package*.json", "./"]

# Install dependencies specified in package.json and move node_modules directory up one level
RUN npm install && mv node_modules ../

# Copy server.js file to the working directory
COPY ["server.js", "./"]

# Expose port 3000 to the outside world
EXPOSE 3000

# Change the ownership of the working directory to the 'node' user
RUN chown -R node /usr/src/server

# Switch to the 'node' user
USER node

# Specify the default command to run when the container starts
CMD ["npm", "start"]