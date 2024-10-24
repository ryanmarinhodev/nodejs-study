# Etapa de construção (build)
FROM node:16-alpine AS build

WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências (incluindo as de desenvolvimento)
RUN npm install

# Garante que o TypeScript tenha permissões de execução
RUN chmod +x ./node_modules/.bin/tsc

# Copia todo o código fonte para o diretório de trabalho
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# Etapa final - Ambiente de produção
FROM node:16-alpine

WORKDIR /app

# Copia apenas os arquivos compilados da etapa de construção
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "./dist/server.js"]