# Configuração do Google Analytics 4 (GA4) - ConversaFina

## 📋 Pré-requisitos

1. Conta Google Analytics
2. Propriedade GA4 criada
3. Measurement ID (formato: G-XXXXXXXXXX)

## 🚀 Configuração

### 1. Criar Propriedade GA4

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em "Criar propriedade"
3. Configure a propriedade:
   - Nome: "ConversaFina"
   - Fuso horário: "America/Sao_Paulo"
   - Moeda: "Real brasileiro (BRL)"
4. Clique em "Próximo"
5. Configure informações do negócio
6. Clique em "Criar"

### 2. Obter Measurement ID

1. Na propriedade criada, vá em "Administrador"
2. Em "Propriedade", clique em "Configurações de dados"
3. Copie o "ID de medição" (G-XXXXXXXXXX)

### 3. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto frontend:
```bash
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Substitua `G-XXXXXXXXXX` pelo seu Measurement ID real

### 4. Configurar Eventos Personalizados

No GA4, vá em "Configurar" > "Eventos personalizados" e crie os seguintes eventos:

#### Eventos de Chatbot
- `chatbot_session_start`
- `message_sent`
- `response_received`
- `chatbot_session_duration`

#### Eventos de Usuário
- `user_login`
- `user_logout`
- `profile_evaluation`

#### Eventos de Erro
- `error_occurred`

## 📊 Eventos Rastreados

### Chatbot Session
```javascript
// Início de sessão
trackChatbotSessionStart(userId, profileType)

// Mensagem enviada
trackMessageSent(userId, messageLength, profileType)

// Resposta recebida
trackResponseReceived(userId, responseLength, responseTime, profileType)

// Duração da sessão
trackChatbotSessionDuration(userId, durationSeconds, messageCount, profileType)
```

### Usuário
```javascript
// Login
trackLogin(userId, method)

// Logout
trackLogout(userId)

// Avaliação de perfil
trackProfileEvaluation(userId, evaluationType, score)
```

### Erros
```javascript
// Erro
trackError(userId, errorType, errorMessage)
```

## 🔍 Visualização dos Dados

### Relatórios Disponíveis

1. **Tempo Médio de Sessão**:
   - Evento: `chatbot_session_duration`
   - Métrica: `duration_seconds`

2. **Mensagens por Usuário**:
   - Evento: `message_sent`
   - Métrica: `message_length`

3. **Tempo de Resposta**:
   - Evento: `response_received`
   - Métrica: `response_time_ms`

4. **Perfil dos Usuários**:
   - Evento: `profile_evaluation`
   - Métrica: `score`

### Consultas BigQuery (Opcional)

```sql
-- Tempo médio de sessão por perfil
SELECT
  user_id,
  profile_type,
  AVG(duration_seconds) as avg_session_duration,
  COUNT(*) as session_count
FROM `your-project.analytics_123456789.events_*`
WHERE event_name = 'chatbot_session_duration'
GROUP BY user_id, profile_type
ORDER BY avg_session_duration DESC;
```

## 🛠️ Debug e Teste

### 1. DebugView
1. No GA4, vá em "Relatórios" > "DebugView"
2. Abra o console do navegador
3. Verifique se os eventos estão sendo enviados

### 2. Console Logs
```javascript
// Adicione logs para debug
console.log('Evento enviado:', eventName, parameters);
```

### 3. Teste Local
1. Execute `npm start`
2. Abra o DevTools
3. Verifique a aba Network para requests do GA4

## 📈 Métricas Importantes

### ConversaFina
- **Tempo médio de sessão**: 5-15 minutos
- **Mensagens por sessão**: 10-30 mensagens
- **Taxa de conclusão de avaliação**: >80%
- **Tempo de resposta da IA**: <30 segundos

### Alertas Recomendados
- Sessões com duração >30 minutos
- Erros de resposta da IA >10%
- Usuários com 0 mensagens em 24h

## 🔧 Personalização

### Adicionar Novos Eventos
```javascript
// Em config/analytics.ts
export const trackCustomEvent = (userId: string, customData: any) => {
  trackEvent('custom_event_name', {
    user_id: userId,
    ...customData,
  });
};
```

### Modificar Parâmetros
```javascript
// Exemplo: adicionar localização
trackEvent('message_sent', {
  user_id: userId,
  message_length: messageLength,
  profile_type: profileType,
  user_location: 'BR', // Novo parâmetro
  timestamp: new Date().toISOString(),
});
```

## 🚨 Troubleshooting

### Problema: Eventos não aparecem no GA4
**Solução:**
1. Verifique o Measurement ID
2. Aguarde 24-48 horas para processamento
3. Use DebugView para verificação imediata

### Problema: Erro de CORS
**Solução:**
1. Verifique se o domínio está configurado no GA4
2. Adicione domínios em "Configurar" > "Fluxos de dados"

### Problema: Eventos duplicados
**Solução:**
1. Verifique se o ReactGA está sendo inicializado apenas uma vez
2. Use `useEffect` com dependências vazias

## 📞 Suporte

Para dúvidas sobre implementação, consulte:
- [Documentação React GA4](https://github.com/PriceRunner/react-ga4)
- [Google Analytics Help](https://support.google.com/analytics)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)