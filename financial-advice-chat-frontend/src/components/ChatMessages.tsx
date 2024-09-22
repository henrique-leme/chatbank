import React from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
  createdAt: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isAssistantTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isAssistantTyping,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isAssistantTyping]);

  return (
    <div className="flex-grow p-4 overflow-auto">
      {messages.length > 0 ? (
        <>
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === "user" ? (
                <div className="flex justify-end mb-2">
                  <div className="p-2 bg-blue-600 text-white rounded-lg max-w-xs">
                    <p>{msg.text}</p>
                    <p className="text-xs text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start mb-2">
                  <div className="p-2 bg-gray-300 text-gray-800 rounded-lg max-w-xs">
                    <p>{msg.text}</p>
                    <p className="text-xs text-left mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Indicador de "digitando..." */}
          {isAssistantTyping && (
            <div className="flex justify-start mb-2">
              <div className="p-2 bg-gray-300 text-gray-800 rounded-lg max-w-xs">
                <p>
                  Processando sua mensagem, isso pode levar alguns minutos...
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Nenhuma conversa ainda.</p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
