FROM node:lts-alpine
WORKDIR /usr/src/server
COPY ["package*.json", "./"]
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]