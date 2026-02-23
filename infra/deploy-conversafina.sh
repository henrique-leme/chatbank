#!/usr/bin/env bash
set -e

echo "Inciando script de deploy..."

echo "Iniciando o build e push das imagens para o ecr..."
bash push-frontend-image-to-ecr.sh
bash push-backend-image-to-ecr.sh
bash push-nginx-image-to-ecr.sh

echo "Iniciando o deploy dos containers para o ecs..."
terraform -chdir=terraform init -upgrade
terraform -chdir=terraform apply -auto-approve

echo "Deploy concluido com sucesso!"