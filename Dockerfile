FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/server
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
RUN npm install -g nodemon
EXPOSE 3000
RUN chown -R node /usr/src/server
USER node
CMD ["nodemon", "server.js"]
