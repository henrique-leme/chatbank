FROM node:22-slim AS build

WORKDIR /app

# Copiar todo o codigo fonte
COPY financial-advice-chat-frontend .

# Limpar qualquer node_modules copiado e instalar do zero
RUN rm -rf node_modules && npm install

# Buildar
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
