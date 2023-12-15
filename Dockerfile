FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/server
COPY ["package.json", "package-lock.json", "server.js", "./"]
RUN npm install && mv node_modules ../
COPY ["server.js", "./"]
EXPOSE 3000
RUN chown -R node /usr/src/server
USER node
CMD ["npm", "start"]