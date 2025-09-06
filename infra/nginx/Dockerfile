FROM ubuntu

RUN apt update && apt install nginx -y

COPY infra/nginx/config/ssl /etc/nginx/ssl
COPY infra/nginx/config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443

ENTRYPOINT ["sh", "-c", "nginx -g 'daemon off;'"]