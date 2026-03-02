FROM node:22-slim AS build

WORKDIR /app

# Copiar todo o codigo fonte
COPY financial-advice-chat-frontend .

# Limpar qualquer node_modules copiado e instalar do zero
RUN rm -rf node_modules && npm install

# Variaveis de ambiente do React (compile-time, baked into JS bundle)
ENV REACT_APP_FIREBASE_API_KEY=AIzaSyDFA7fWgs9TdDCRQmq3-fOzdnEE5p2aLnY
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=financial-advice-chat.firebaseapp.com
ENV REACT_APP_FIREBASE_DATABASE_URL=https://financial-advice-chat-default-rtdb.firebaseio.com
ENV REACT_APP_FIREBASE_PROJECT_ID=financial-advice-chat
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=financial-advice-chat.appspot.com
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1076679718791
ENV REACT_APP_FIREBASE_APP_ID=1:1076679718791:web:15fad23b2870d4b4e7c522
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=G-B5QBJ9F7E6
ENV REACT_APP_BACKEND_URL=https://conversafina.ddnsfree.com/backend

# Buildar
RUN npm run build

# Stage de producao
FROM node:22-slim

# Instalar curl e serve
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g serve

WORKDIR /app

# Copiar apenas o build estatico (sem node_modules, sem source)
COPY --from=build /app/build ./build

# Script de atualizacao de DNS na inicializacao
COPY infra/frontend/config/update-dns.sh /usr/local/bin/update-dns.sh
RUN chmod +x /usr/local/bin/update-dns.sh

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "/usr/local/bin/update-dns.sh && serve -s build -l 8080"]
