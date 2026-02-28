#!/bin/sh
# Atualiza o DNS dinamico (Dynu) com o IP publico do container ECS
# Roda uma vez na inicializacao - o IP da task nao muda enquanto ela esta rodando

HOSTNAME="conversafina.ddnsfree.com"
DYNU_USER="lomonteiro"
DYNU_PASS="#123Mudar"

echo "[DNS] Obtendo IP publico..."
MY_IP=$(curl -s --max-time 10 https://checkip.dynu.com/ | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')

if [ -z "$MY_IP" ]; then
  echo "[DNS] ERRO: Nao conseguiu obter IP publico. DNS nao atualizado."
  exit 0
fi

echo "[DNS] IP publico: $MY_IP"
echo "[DNS] Atualizando $HOSTNAME -> $MY_IP"

RESULT=$(curl -s --max-time 10 -u "$DYNU_USER:$DYNU_PASS" "https://api.dynu.com/nic/update?hostname=$HOSTNAME&myip=$MY_IP")

echo "[DNS] Resposta Dynu: $RESULT"

case "$RESULT" in
  good*|nochg*) echo "[DNS] DNS atualizado com sucesso!" ;;
  *) echo "[DNS] AVISO: Resposta inesperada, mas continuando..." ;;
esac
