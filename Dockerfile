FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Verifica as permissões do tsc
RUN ls -l ./node_modules/.bin/tsc

COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "./dist/server.js"]