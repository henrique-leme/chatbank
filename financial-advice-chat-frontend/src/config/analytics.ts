import ReactGA from 'react-ga4';

// Usando o Measurement ID do Firebase que já existe no .env
const GA4_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-B5QBJ9F7E6';

// Inicializar GA4
export const initializeGA4 = () => {
  ReactGA.initialize(GA4_MEASUREMENT_ID, {
    debug: process.env.NODE_ENV === 'development',
    testMode: process.env.NODE_ENV === 'test'
  });
};

// Configurar User ID para rastreamento entre sessões
export const setUserId = (userId: string) => {
  ReactGA.set({ user_id: userId });
};

// Rastrear página
export const trackPageView = (page: string) => {
  ReactGA.send({ hitType: 'pageview', page });
};

// Rastrear evento personalizado
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
) => {
  ReactGA.event(eventName, {
    ...parameters,
  });
};

// Rastrear início de sessão do chatbot
export const trackChatbotSessionStart = (userId: string, profileType: string) => {
  trackEvent('chatbot_session_start', {
    user_id: userId,
    profile_type: profileType,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear mensagem enviada
export const trackMessageSent = (
  userId: string,
  messageLength: number,
  profileType: string
) => {
  trackEvent('message_sent', {
    user_id: userId,
    message_length: messageLength,
    profile_type: profileType,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear resposta recebida
export const trackResponseReceived = (
  userId: string,
  responseLength: number,
  responseTime: number,
  profileType: string
) => {
  trackEvent('response_received', {
    user_id: userId,
    response_length: responseLength,
    response_time_ms: responseTime,
    profile_type: profileType,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear tempo de sessão do chatbot
export const trackChatbotSessionDuration = (
  userId: string,
  durationSeconds: number,
  messageCount: number,
  profileType: string
) => {
  trackEvent('chatbot_session_duration', {
    user_id: userId,
    duration_seconds: durationSeconds,
    message_count: messageCount,
    profile_type: profileType,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear avaliação de perfil
export const trackProfileEvaluation = (
  userId: string,
  evaluationType: string,
  score: number
) => {
  trackEvent('profile_evaluation', {
    user_id: userId,
    evaluation_type: evaluationType,
    score: score,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear login
export const trackLogin = (userId: string, method: string) => {
  trackEvent('user_login', {
    user_id: userId,
    login_method: method,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear logout
export const trackLogout = (userId: string) => {
  trackEvent('user_logout', {
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear erro
export const trackError = (
  userId: string,
  errorType: string,
  errorMessage: string
) => {
  trackEvent('error_occurred', {
    user_id: userId,
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString(),
  });
};

// Classe para rastrear tempo de sessão
export class ChatbotSessionTracker {
  private startTime: number;
  private userId: string;
  private profileType: string;
  private messageCount: number = 0;

  constructor(userId: string, profileType: string) {
    this.startTime = Date.now();
    this.userId = userId;
    this.profileType = profileType;
    this.messageCount = 0;
  }

  // Incrementar contador de mensagens
  incrementMessageCount() {
    this.messageCount++;
  }

  // Finalizar sessão e enviar dados
  endSession() {
    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

    trackChatbotSessionDuration(
      this.userId,
      durationSeconds,
      this.messageCount,
      this.profileType
    );

    return {
      durationSeconds,
      messageCount: this.messageCount,
    };
  }

  // Obter tempo atual da sessão
  getCurrentDuration() {
    return Math.round((Date.now() - this.startTime) / 1000);
  }
}