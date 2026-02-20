FROM node:22-slim AS build

WORKDIR /app

# Copiar package files primeiro para otimizar cache de layers
COPY financial-advice-chat-frontend/package*.json ./
RUN npm install

# Copiar codigo fonte e buildar
COPY financial-advice-chat-frontend .
RUN npm run build

# Stage de producao
FROM node:22-slim

# Instalar ddclient e serve
RUN apt-get update && apt-get install -y --no-install-recommends ddclient && rm -rf /var/lib/apt/lists/*
RUN npm install -g serve

# Configurar ddclient
COPY infra/frontend/config/ddclient.conf /etc/ddclient.conf

WORKDIR /app

# Copiar apenas o build estatico (sem node_modules, sem source)
COPY --from=build /app/build ./build

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "ddclient & serve -s build -l 8080"]
