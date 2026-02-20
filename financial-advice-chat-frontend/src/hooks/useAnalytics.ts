import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  initializeGA4,
  trackPageView,
  trackChatbotSessionStart,
  trackMessageSent,
  trackResponseReceived,
  trackLogin,
  trackLogout,
  trackError,
  trackProfileEvaluation as trackProfileEvaluationGA,
  ChatbotSessionTracker,
} from '../config/analytics';

export const useAnalytics = () => {
  const { user } = useAuth();
  const sessionTrackerRef = useRef<ChatbotSessionTracker | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Inicializar GA4 na primeira renderização
  useEffect(() => {
    initializeGA4();
  }, []);

  // Rastrear mudanças de página
  useEffect(() => {
    if (user) {
      trackPageView(window.location.pathname);
    }
  }, [user]);

  // Iniciar sessão do chatbot
  const startChatbotSession = useCallback((profileType: string) => {
    if (user && !isSessionActive) {
      sessionTrackerRef.current = new ChatbotSessionTracker(user.uid, profileType);
      trackChatbotSessionStart(user.uid, profileType);
      setIsSessionActive(true);
    }
  }, [user, isSessionActive]);

  // Finalizar sessão do chatbot
  const endChatbotSession = useCallback(() => {
    if (sessionTrackerRef.current) {
      const sessionData = sessionTrackerRef.current.endSession();
      sessionTrackerRef.current = null;
      setIsSessionActive(false);
      return sessionData;
    }
    return null;
  }, []);

  // Rastrear mensagem enviada
  const trackMessage = (message: string) => {
    if (user && sessionTrackerRef.current) {
      sessionTrackerRef.current.incrementMessageCount();
      trackMessageSent(user.uid, message.length, user.profileType || 'basic');
    }
  };

  // Rastrear resposta recebida
  const trackResponse = (response: string, responseTime: number) => {
    if (user) {
      trackResponseReceived(
        user.uid,
        response.length,
        responseTime,
        user.profileType || 'basic'
      );
    }
  };

  // Rastrear login
  const trackUserLogin = (method: string) => {
    if (user) {
      trackLogin(user.uid, method);
    }
  };

  // Rastrear logout
  const trackUserLogout = () => {
    if (user) {
      trackLogout(user.uid);
      // Finalizar sessão do chatbot se estiver ativa
      if (isSessionActive) {
        endChatbotSession();
      }
    }
  };

  // Rastrear erro
  const trackUserError = useCallback((errorType: string, errorMessage: string) => {
    if (user) {
      trackError(user.uid, errorType, errorMessage);
    }
  }, [user]);

  // Rastrear avaliação de perfil
  const trackProfileEvaluation = (userId: string, evaluationType: string, score: number) => {
    trackProfileEvaluationGA(userId, evaluationType, score);
  };

  // Obter tempo atual da sessão
  const getCurrentSessionDuration = () => {
    if (sessionTrackerRef.current) {
      return sessionTrackerRef.current.getCurrentDuration();
    }
    return 0;
  };

  // Limpar sessão quando componente for desmontado
  useEffect(() => {
    return () => {
      endChatbotSession();
    };
  }, [endChatbotSession]);

  return {
    startChatbotSession,
    endChatbotSession,
    trackMessage,
    trackResponse,
    trackUserLogin,
    trackUserLogout,
    trackUserError,
    trackProfileEvaluation,
    getCurrentSessionDuration,
    isSessionActive,
  };
};