FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN chmod +x ./node_modules/.bin/tsc

COPY . .

RUN chown -R node:node /app

USER root

RUN npm run build