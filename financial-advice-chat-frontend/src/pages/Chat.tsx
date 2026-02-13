import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getChatHistory, sendMessage, getUserProfile } from "../api/apiRoutes";
import Sidebar from "../components/SideBar";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileEvaluationModal from "../components/ProfileEvaluationModal";
import ChatMessages from "../components/ChatMessages";
import { useAnalytics } from "../hooks/useAnalytics";
import SessionStats from "../components/SessionStats";
import AnalyticsDebug from "../components/AnalyticsDebug";

interface Message {
  sender: "user" | "bot";
  text: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  secondName: string;
  age: number;
  income: number;
  profileType: "basic" | "advanced";
  email: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Analytics hook
  const {
    startChatbotSession,
    endChatbotSession,
    trackMessage,
    trackResponse,
    trackUserError,
    getCurrentSessionDuration,
    isSessionActive,
  } = useAnalytics();

  useEffect(() => {
    if (location.state?.showEvaluationModal) {
      setShowEvaluationModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          const chatHistory = await getChatHistory();

          const messagesFromHistory: Message[] = [];
          chatHistory.messages.forEach((msg) => {
            messagesFromHistory.push({
              sender: "user",
              text: msg.question,
              createdAt: new Date(msg.createdAt).toISOString(),
            });
            if (msg.answer) {
              messagesFromHistory.push({
                sender: "bot",
                text: msg.answer,
                createdAt: new Date(msg.createdAt).toISOString(),
              });
            }
          });

          const sortedMessages = messagesFromHistory.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          setMessages(sortedMessages);
          setLoadingMessages(false);

          const profileData = await getUserProfile(user.uid);
          setUserProfile(profileData);
          setLoadingProfile(false);

          // Iniciar sessão do chatbot com analytics
          startChatbotSession(profileData.profileType);

          if (profileData.profileType === "basic") {
            setShowEvaluationModal(true);
          }
        } catch (error) {
          console.error("Erro ao carregar histórico de chat ou perfil:", error);
          trackUserError("chat_load_error", error.toString());
          setLoadingMessages(false);
          setLoadingProfile(false);
        }
      }
    };

    loadChatHistory();
  }, [user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && !isSending) {
      try {
        setIsSending(true);
        setIsAssistantTyping(true);

        const startTime = Date.now();
        const nowIsoString = new Date().toISOString();

        // Rastrear mensagem enviada
        trackMessage(newMessage);

        const userMessage: Message = {
          sender: "user",
          text: newMessage,
          createdAt: nowIsoString,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setNewMessage("");

        const response = await sendMessage(newMessage);
        const responseTime = Date.now() - startTime;

        // Rastrear resposta recebida
        trackResponse(response.answer, responseTime);

        const botMessage: Message = {
          sender: "bot",
          text: response.answer,
          createdAt: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        trackUserError("message_send_error", error.toString());
      } finally {
        setIsAssistantTyping(false);
        setIsSending(false);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar />

      <div className="flex flex-col flex-grow bg-gray-200 relative">
        <div className="sm:hidden p-4 flex gap-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            {showProfile ? "Fechar Perfil" : "Mostrar Perfil"}
          </button>
          <button
            onClick={() => setShowSessionStats(!showSessionStats)}
            className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            {showSessionStats ? "Ocultar Stats" : "Mostrar Stats"}
          </button>
        </div>

        {showProfile && !loadingProfile && userProfile && (
          <div className="absolute top-16 left-4 w-64 bg-white rounded-lg shadow-lg p-4">
            <div>
              <h3 className="text-lg font-bold">
                Perfil de {userProfile.name}
              </h3>
              <p>Email: {userProfile.email}</p>
              <p>Idade: {userProfile.age}</p>
              <p>Renda: {userProfile.income}</p>
              <p>Perfil: {userProfile.profileType}</p>
            </div>
          </div>
        )}

        <ChatMessages
          messages={messages}
          isAssistantTyping={isAssistantTyping}
        />

        <div className="p-4 bg-white border-t">
          <div className="flex items-center">
            <input
              className="flex-grow p-2 border border-gray-300 rounded-l text-gray-700 focus:outline-none"
              placeholder="Digite sua pergunta..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              className={`p-2 ${
                isSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-r focus:outline-none`}
              disabled={isSending}
            >
              Enviar
            </button>
          </div>
        </div>

        {showEvaluationModal && (
          <ProfileEvaluationModal
            onClose={() => setShowEvaluationModal(false)}
            onConfirm={() => {
              setShowEvaluationModal(false);
              navigate("/profile-evaluation");
            }}
          />
        )}

        <SessionStats
          isVisible={showSessionStats}
          onClose={() => setShowSessionStats(false)}
        />

        <AnalyticsDebug />
      </div>
    </div>
  );
};

export default Chat;
