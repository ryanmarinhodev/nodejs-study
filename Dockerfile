# Etapa de construção
FROM node:14-alpine AS build

WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# Etapa final - Ambiente de produção
FROM node:16 AS build

WORKDIR /app

# Copia os arquivos do build
COPY --from=build /app ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]