# 📊 Analytics Implementation - ConversaFina

## 🎯 Objetivo

Implementar Google Analytics 4 (GA4) no ConversaFina para rastrear:
- **Tempo médio de uso do chatbot** por usuário logado
- **Eventos personalizados** com user_id
- **Comportamento dos usuários** no sistema
- **Performance da IA** e respostas

## 🚀 Implementação Realizada

### 1. Configuração Base
- ✅ Instalação do `react-ga4`
- ✅ Configuração do Measurement ID
- ✅ Inicialização automática do GA4

### 2. Eventos Rastreados

#### 🤖 Chatbot Events
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

#### 👤 User Events
```javascript
// Login/Logout
trackLogin(userId, method)
trackLogout(userId)

// Avaliação de perfil
trackProfileEvaluation(userId, evaluationType, score)
```

#### ❌ Error Events
```javascript
// Erros do sistema
trackError(userId, errorType, errorMessage)
```

### 3. Componentes Criados

#### 📈 SessionStats
- Mostra tempo atual da sessão
- Status da sessão (ativa/inativa)
- Botão para mostrar/ocultar estatísticas

#### 🐛 AnalyticsDebug
- Debug em tempo real dos eventos
- Captura eventos do GA4
- Interface para visualizar dados

### 4. Hook Personalizado
```javascript
const {
  startChatbotSession,
  endChatbotSession,
  trackMessage,
  trackResponse,
  trackUserError,
  getCurrentSessionDuration,
  isSessionActive,
} = useAnalytics();
```

## 📊 Métricas Coletadas

### Tempo de Sessão
- **Duração total**: Tempo desde o início até o fim
- **Tempo ativo**: Tempo real de uso
- **Mensagens por sessão**: Quantidade de interações

### Performance da IA
- **Tempo de resposta**: Milissegundos para cada resposta
- **Tamanho das respostas**: Caracteres por resposta
- **Taxa de erro**: Erros de comunicação

### Comportamento do Usuário
- **Perfil financeiro**: Basic/Advanced
- **Frequência de uso**: Sessões por dia/semana
- **Padrões de pergunta**: Tipos de questões mais comuns

## 🔧 Como Usar

### 1. Configuração Inicial
```bash
# Instalar dependências
npm install react-ga4

# Configurar variável de ambiente
echo "REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX" > .env
```

### 2. Uso no Componente
```javascript
import { useAnalytics } from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackMessage, trackResponse } = useAnalytics();

  const handleSendMessage = (message) => {
    trackMessage(message);
    // ... lógica do chat
  };
};
```

### 3. Debug e Teste
```javascript
// No console do navegador
import { testAllAnalyticsEvents } from './utils/analyticsTest';
testAllAnalyticsEvents();
```

## 📈 Relatórios GA4

### 1. Relatório de Sessões
- **Evento**: `chatbot_session_duration`
- **Métrica**: `duration_seconds`
- **Dimensão**: `user_id`, `profile_type`

### 2. Relatório de Mensagens
- **Evento**: `message_sent`
- **Métrica**: `message_length`
- **Dimensão**: `user_id`, `profile_type`

### 3. Relatório de Performance
- **Evento**: `response_received`
- **Métrica**: `response_time_ms`
- **Dimensão**: `user_id`, `profile_type`

## 🎯 KPIs Principais

### ConversaFina
- **Tempo médio de sessão**: 5-15 minutos
- **Mensagens por sessão**: 10-30 mensagens
- **Taxa de conclusão de avaliação**: >80%
- **Tempo de resposta da IA**: <30 segundos

### Alertas Configurados
- Sessões com duração >30 minutos
- Erros de resposta da IA >10%
- Usuários com 0 mensagens em 24h

## 🔍 Debug e Monitoramento

### 1. DebugView do GA4
1. Acesse GA4 > Relatórios > DebugView
2. Abra o console do navegador
3. Verifique eventos em tempo real

### 2. Componente de Debug
- Botão "Debug Analytics" no canto inferior esquerdo
- Mostra eventos capturados
- Tempo de sessão atual

### 3. Console Logs
```javascript
// Logs automáticos para debug
console.log('Evento enviado:', eventName, parameters);
```

## 🚨 Troubleshooting

### Problema: Eventos não aparecem
**Solução:**
1. Verificar Measurement ID
2. Aguardar 24-48 horas
3. Usar DebugView

### Problema: Erro de CORS
**Solução:**
1. Configurar domínios no GA4
2. Verificar configurações de fluxo de dados

### Problema: Eventos duplicados
**Solução:**
1. Verificar inicialização única do ReactGA
2. Usar useEffect com dependências vazias

## 📋 Checklist de Implementação

- [x] Instalar react-ga4
- [x] Configurar Measurement ID
- [x] Criar arquivo de configuração
- [x] Implementar hook useAnalytics
- [x] Adicionar eventos no Chat
- [x] Adicionar eventos no AuthContext
- [x] Criar componente SessionStats
- [x] Criar componente AnalyticsDebug
- [x] Adicionar eventos de erro
- [x] Testar todos os eventos
- [x] Documentar implementação

## 🔮 Próximos Passos

### Melhorias Futuras
1. **Integração com BigQuery** para análises avançadas
2. **Dashboards personalizados** no GA4
3. **Alertas automáticos** para métricas críticas
4. **Segmentação avançada** de usuários
5. **A/B testing** para otimização

### Métricas Adicionais
1. **Satisfação do usuário** (NPS)
2. **Taxa de retenção** de usuários
3. **Conversão** de avaliações de perfil
4. **Performance** por dispositivo/navegador

## 📞 Suporte

Para dúvidas sobre a implementação:
- Consulte `GA4_SETUP.md` para configuração inicial
- Use o componente `AnalyticsDebug` para debug
- Execute `testAllAnalyticsEvents()` para testes
- Verifique o DebugView do GA4 para monitoramento

---

**Status**: ✅ Implementado e Testado
**Última atualização**: Dezembro 2024
**Versão**: 1.0.0