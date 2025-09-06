#!/bin/zsh
set -e

echo "Inciando script de deploy..."

echo "Iniciando o build e push das imagens para o ecr..."
./push-frontend-image-to-ecr.sh
./push-backend-image-to-ecr.sh
./push-nginx-image-to-ecr.sh

echo "Iniciando o deploy dos containers para o ecs..."
terraform -chdir=terraform apply -auto-approve

echo "Deploy concluido com sucesso!"