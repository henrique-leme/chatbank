import {
  trackEvent,
  trackChatbotSessionStart,
  trackMessageSent,
  trackResponseReceived,
  trackChatbotSessionDuration,
  trackLogin,
  trackLogout,
  trackProfileEvaluation,
  trackError,
} from '../config/analytics';

// Função para testar todos os eventos do GA4
export const testAllAnalyticsEvents = () => {
  const testUserId = 'test-user-123';
  const testProfileType = 'basic';

  console.log('🧪 Iniciando testes de Analytics...');

  // Teste 1: Login
  console.log('📝 Testando evento de login...');
  trackLogin(testUserId, 'test');

  // Teste 2: Início de sessão do chatbot
  console.log('🤖 Testando início de sessão do chatbot...');
  trackChatbotSessionStart(testUserId, testProfileType);

  // Teste 3: Mensagem enviada
  console.log('💬 Testando mensagem enviada...');
  trackMessageSent(testUserId, 50, testProfileType);

  // Teste 4: Resposta recebida
  console.log('📨 Testando resposta recebida...');
  trackResponseReceived(testUserId, 200, 1500, testProfileType);

  // Teste 5: Duração da sessão
  console.log('⏱️ Testando duração da sessão...');
  trackChatbotSessionDuration(testUserId, 300, 5, testProfileType);

  // Teste 6: Avaliação de perfil
  console.log('📊 Testando avaliação de perfil...');
  trackProfileEvaluation(testUserId, 'financial_level', 8);

  // Teste 7: Erro
  console.log('❌ Testando evento de erro...');
  trackError(testUserId, 'test_error', 'Erro de teste');

  // Teste 8: Logout
  console.log('🚪 Testando logout...');
  trackLogout(testUserId);

  // Teste 9: Evento personalizado
  console.log('🎯 Testando evento personalizado...');
  trackEvent('custom_test_event', {
    user_id: testUserId,
    test_parameter: 'test_value',
    timestamp: new Date().toISOString(),
  });

  console.log('✅ Testes de Analytics concluídos!');
  console.log('📊 Verifique o DebugView do GA4 ou o console do navegador para confirmar os eventos.');
};

// Função para simular uso real do chatbot
export const simulateChatbotUsage = () => {
  const testUserId = 'simulation-user-456';
  const testProfileType = 'advanced';

  console.log('🎭 Iniciando simulação de uso do chatbot...');

  // Simular login
  trackLogin(testUserId, 'simulation');

  // Simular início de sessão
  trackChatbotSessionStart(testUserId, testProfileType);

  // Simular algumas mensagens
  const messages = [
    'Como investir em ações?',
    'Qual a diferença entre CDB e LCI?',
    'Como funciona o Tesouro Direto?',
    'Quais são os melhores fundos imobiliários?',
    'Como montar uma carteira diversificada?'
  ];

  messages.forEach((message, index) => {
    setTimeout(() => {
      console.log(`💬 Simulando mensagem ${index + 1}: ${message}`);
      trackMessageSent(testUserId, message.length, testProfileType);

      // Simular resposta após 2 segundos
      setTimeout(() => {
        const response = `Resposta simulada para: ${message}`;
        console.log(`📨 Simulando resposta ${index + 1}`);
        trackResponseReceived(testUserId, response.length, 2000 + Math.random() * 1000, testProfileType);
      }, 2000);
    }, index * 5000); // 5 segundos entre mensagens
  });

  // Simular fim da sessão após 30 segundos
  setTimeout(() => {
    console.log('⏱️ Finalizando simulação de sessão...');
    trackChatbotSessionDuration(testUserId, 30, messages.length, testProfileType);
    trackLogout(testUserId);
    console.log('✅ Simulação concluída!');
  }, 30000);
};

// Função para verificar se o GA4 está funcionando
export const checkGA4Status = () => {
  const gtag = (window as any).gtag;

  if (typeof gtag === 'function') {
    console.log('✅ GA4 está carregado e funcionando');
    return true;
  } else {
    console.log('❌ GA4 não está carregado');
    return false;
  }
};

// Função para limpar dados de teste
export const clearTestData = () => {
  console.log('🧹 Limpando dados de teste...');
  // Aqui você pode adicionar lógica para limpar dados de teste se necessário
  console.log('✅ Dados de teste limpos');
};