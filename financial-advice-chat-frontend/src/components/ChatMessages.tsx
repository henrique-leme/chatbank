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

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatBotMessage = (text: string): JSX.Element => {
    const sentences = text
      .split(".")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    return (
      <>
        {sentences.map((sentence, index) => (
          <React.Fragment key={index}>
            <p>{sentence}.</p>
            {index < sentences.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="flex-grow p-4 overflow-auto">
      {messages.length > 0 ? (
        <>
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === "user" ? (
                <div className="flex justify-end mb-2">
                  <div className="p-2 bg-blue-600 text-white rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <p>{msg.text}</p>
                    <p className="text-xs text-right mt-1">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start mb-2">
                  <div className="p-2 bg-gray-300 text-gray-800 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    {/** Utiliza a função formatBotMessage para quebrar linhas */}
                    <div>{formatBotMessage(msg.text)}</div>
                    <p className="text-xs text-left mt-1">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Indicador de "digitando..." */}
          {isAssistantTyping && (
            <div className="flex justify-start mb-2">
              <div className="p-2 bg-gray-300 text-gray-800 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
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
