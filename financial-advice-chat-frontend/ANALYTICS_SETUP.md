# 📊 Google Analytics 4 (GA4) Setup Guide

## 🔧 Instalação Necessária

Primeiro, instale a biblioteca react-ga4:

```bash
npm install react-ga4
```

## ⚙️ Configuração do Ambiente

1. **Adicione a variável GA4 no seu arquivo `.env`:**
```env
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Substitua `G-XXXXXXXXXX` pelo seu Measurement ID real do GA4**

## 📍 Como Obter o Measurement ID

1. Acesse [Google Analytics](https://analytics.google.com)
2. Selecione sua propriedade GA4
3. Vá em **Admin** > **Data Streams**
4. Clique no seu stream da web
5. Copie o **Measurement ID** (formato: G-XXXXXXXXXX)

## 🚀 Funcionalidades Implementadas

### ✅ Eventos Rastreados

- **`chatbot_session_start`** - Início de sessão do chatbot
- **`message_sent`** - Mensagem enviada pelo usuário
- **`response_received`** - Resposta recebida da IA
- **`chatbot_session_duration`** - Duração da sessão
- **`user_login`** - Login do usuário
- **`user_logout`** - Logout do usuário
- **`error_occurred`** - Erros no sistema

### 📊 Métricas de Chatbot

- **Tempo médio de sessão** por usuário
- **Número de mensagens** por sessão
- **Tempo de resposta** da IA
- **Taxa de erro** por usuário
- **Tipo de perfil** (básico/avançado)

## 🔄 Como os Eventos são Enviados

### 1. Login do Usuário
```javascript
// Configura User ID no GA4
setUserId(firebaseUser.uid);
trackLogin(firebaseUser.uid, 'firebase');
```

### 2. Início de Sessão do Chatbot
```javascript
startChatbotSession(profileType);
// Envia: chatbot_session_start
```

### 3. Mensagem Enviada
```javascript
trackMessage(newMessage);
// Envia: message_sent com parâmetros:
// - user_id
// - message_length
// - profile_type
// - timestamp
```

### 4. Resposta Recebida
```javascript
trackResponse(response.answer, responseTime);
// Envia: response_received com parâmetros:
// - user_id
// - response_length
// - response_time_ms
// - profile_type
// - timestamp
```

## 🐛 Debug Mode

O GA4 está configurado com debug no desenvolvimento:

```javascript
ReactGA.initialize(GA4_MEASUREMENT_ID, {
  debug: process.env.NODE_ENV === 'development',
  testMode: process.env.NODE_ENV === 'test'
});
```

## 📈 Visualização no GA4

### 1. Eventos em Tempo Real
- Vá para **Reports** > **Realtime**
- Veja eventos sendo enviados em tempo real

### 2. Análise de Eventos
- Vá para **Reports** > **Events**
- Filtre pelos eventos customizados

### 3. User Explorer
- Vá para **Reports** > **User Explorer**
- Analise comportamento individual por `user_id`

## 🔍 Teste da Implementação

Para verificar se está funcionando:

1. **Abra Developer Tools (F12)**
2. **Console:** Procure por logs do GA4
3. **Network:** Verifique requests para `google-analytics.com`
4. **GA4 Real-time:** Veja eventos aparecerem

## ⚡ Componentes de Debug

### SessionStats
Mostra estatísticas da sessão atual:
- Tempo de sessão
- Número de mensagens
- Status da sessão

### AnalyticsDebug
Debug visual dos eventos enviados (apenas em desenvolvimento)

## 📋 Checklist de Verificação

- [ ] `react-ga4` instalado
- [ ] `REACT_APP_GA4_MEASUREMENT_ID` configurado no `.env`
- [ ] Measurement ID válido do GA4
- [ ] User ID sendo setado no login
- [ ] Eventos aparecendo no GA4 Real-time
- [ ] Debug logs no console (desenvolvimento)

## 🎯 Métricas Principais para Análise

1. **Engajamento do Chatbot**
   - Tempo médio de sessão
   - Mensagens por sessão
   - Taxa de abandono

2. **Performance da IA**
   - Tempo de resposta médio
   - Taxa de erro
   - Satisfação por tipo de resposta

3. **Segmentação de Usuários**
   - Perfil básico vs avançado
   - Comportamento por renda
   - Padrões de uso

## 🚨 Troubleshooting

### Eventos não aparecem no GA4:
1. Verifique o Measurement ID
2. Confirme se `react-ga4` está instalado
3. Veja o console para erros
4. Aguarde até 24h para dados históricos

### User ID não está sendo rastreado:
1. Confirme `setUserId()` sendo chamado no login
2. Verifique se o usuário está autenticado
3. Teste com usuários diferentes