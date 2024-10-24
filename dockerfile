# Usar uma imagem do Node.js oficial como base
FROM node:18-alpine

# Configurar o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install --omit=dev

# Copiar o restante dos arquivos da aplicação
COPY . .


# Garantir que o TypeScript esteja executável
RUN chmod +x ./node_modules/.bin/tsc


# Compilar o TypeScript para JavaScript
RUN npm run build


# Expor a porta em que o servidor da sua aplicação vai rodar (por exemplo, 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
