#!/usr/bin/env bash
set -e

echo "Inciando script de destrição App Conversafina..."

terraform -chdir=terraform destroy -auto-approve

echo "App Conversafina destruído com sucesso!"