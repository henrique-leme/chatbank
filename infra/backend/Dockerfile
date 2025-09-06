FROM ubuntu

#Instalando pacotes
RUN apt update && apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt update && apt install nodejs -y

#Build
COPY financial-advice-chat-backend /app
WORKDIR /app
RUN npm install && npm run build

#Executando o app
ENV PORT=8081
EXPOSE $PORT
ENTRYPOINT ["sh", "-c", "node dist/index.js"]