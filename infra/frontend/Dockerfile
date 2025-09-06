FROM ubuntu

#Instalando pacotes
RUN apt update && apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt update && apt install nodejs ddclient -y

#Configurando ddclient
COPY infra/frontend/config/ddclient.conf /etc/ddclient.conf
RUN update-rc.d ddclient defaults

#Build
COPY financial-advice-chat-frontend /app
WORKDIR /app
RUN npm install && npm run build && chmod -R 777 /app

#Executando o app
ENV PORT=8080
EXPOSE $PORT
ENTRYPOINT ["sh", "-c", "service ddclient start && npm run start"]