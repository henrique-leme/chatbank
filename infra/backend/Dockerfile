FROM node:22-alpine

WORKDIR /app

# Copiar package files primeiro para otimizar cache de layers
COPY financial-advice-chat-backend/package*.json ./
RUN npm install

# Copiar codigo fonte e buildar
COPY financial-advice-chat-backend .
RUN npm run build

ENV PORT=8081
EXPOSE 8081
ENTRYPOINT ["node", "dist/index.js"]
