FROM node:22-alpine

WORKDIR /app

# Copiar todo o codigo fonte
COPY financial-advice-chat-backend .

# Limpar qualquer node_modules copiado e instalar do zero
RUN rm -rf node_modules && npm install

# Buildar
RUN npm run build

ENV PORT=8081
EXPOSE 8081
ENTRYPOINT ["node", "dist/index.js"]
