import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface SessionStatsProps {
  isVisible: boolean;
  onClose: () => void;
}

const SessionStats: React.FC<SessionStatsProps> = ({ isVisible, onClose }) => {
  const { getCurrentSessionDuration, isSessionActive } = useAnalytics();
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible && isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration(getCurrentSessionDuration());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVisible, isSessionActive, getCurrentSessionDuration]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Estatísticas da Sessão</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Tempo de sessão:</span>
          <span className="text-xs font-medium">{formatDuration(sessionDuration)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-600">Status:</span>
          <span className={`text-xs font-medium ${isSessionActive ? 'text-green-600' : 'text-red-600'}`}>
            {isSessionActive ? 'Ativa' : 'Inativa'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;