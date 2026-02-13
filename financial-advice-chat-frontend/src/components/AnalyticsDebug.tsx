import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  eventName: string;
  parameters: Record<string, any>;
}

// Componente só renderiza em ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

const AnalyticsDebug: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const { getCurrentSessionDuration, isSessionActive } = useAnalytics();

  // Interceptar eventos do GA4 para debug (só em desenvolvimento)
  useEffect(() => {
    if (!isDevelopment || !isVisible) return;

    const originalGtag = (window as any).gtag;
    if (originalGtag) {
      (window as any).gtag = (...args: any[]) => {
        // Chamar função original
        originalGtag.apply(window, args);

        // Capturar evento para debug
        if (args[0] === 'event') {
          const eventName = args[1];
          const parameters = args[2] || {};

          const newEvent: AnalyticsEvent = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            eventName,
            parameters,
          };

          setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Manter apenas os últimos 10
        }
      };
    }

    return () => {
      if (originalGtag) {
        (window as any).gtag = originalGtag;
      }
    };
  }, [isVisible]);

  const formatParameters = (params: Record<string, any>): string => {
    return Object.entries(params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  // Não renderizar em produção
  if (!isDevelopment) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm px-4 py-2 z-50"
      >
        Debug Analytics
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Analytics Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs">
          <span className="font-medium">Session Duration:</span> {getCurrentSessionDuration()}s
        </div>
        <div className="text-xs">
          <span className="font-medium">Session Active:</span> {isSessionActive ? 'Yes' : 'No'}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-600">Recent Events:</h4>
        {events.length === 0 ? (
          <p className="text-xs text-gray-500">No events captured yet</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="text-xs border-l-2 border-blue-500 pl-2">
              <div className="font-medium text-blue-600">{event.eventName}</div>
              <div className="text-gray-600">{event.timestamp}</div>
              <div className="text-gray-500">{formatParameters(event.parameters)}</div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setEvents([])}
        className="mt-2 text-xs text-red-600 hover:text-red-700"
      >
        Clear Events
      </button>
    </div>
  );
};

export default AnalyticsDebug;
