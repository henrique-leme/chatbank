import { useEffect, useState } from "react";
import {
  getFinancialLevelQuestions,
  evaluateFinancialLevel,
} from "../api/apiRoutes";
import Sidebar from "../components/SideBar";

type Question = {
  question: string;
  options: string[];
};

const normalizeText = (text: string): string => {
  return text.replace(/\r\n/g, "\n").replace(/\n\n+/g, "\n").trim();
};

const extractQuestions = (text: string): Question[] => {
  const normalizedText = normalizeText(text);
  const regex = /\d+\.\s(.+?)(?:\n|$).*?(Sim\s*(\/|ou)\s*Não)/gi;
  const matches = [...normalizedText.matchAll(regex)];

  if (matches.length === 0) {
    throw new Error("Nenhuma pergunta encontrada no texto fornecido.");
  }

  return matches.map((match) => ({
    question: match[1].trim(),
    options: ["Sim", "Não"],
  }));
};

const EvaluateProfile = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await getFinancialLevelQuestions();
        const extractedQuestions = extractQuestions(response);
        setQuestions(extractedQuestions);
        setCurrentStep(0);
        setAnswers([]);
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        alert("Erro ao carregar perguntas, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = answer;
    setAnswers(updatedAnswers);
    setCurrentStep(currentStep + 1);
  };

  const handleReview = (index: number) => {
    setCurrentStep(index);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await evaluateFinancialLevel(questions, answers);
      setUserProfile(response.aiResponse || response.profileType);
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      alert("Erro ao enviar respostas.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-grow bg-gray-200 p-4 sm:p-8 flex flex-col items-center overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Avaliação de Perfil Financeiro
        </h2>
        {loading ? (
          <div className="text-center">
            <h2 className="text-xl font-bold">Carregando perguntas...</h2>
          </div>
        ) : userProfile ? (
          <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
            <h3 className="text-lg mb-6">Obrigado por concluir a avaliação!</h3>
            <p className="text-xl font-bold">
              Seu perfil financeiro é: {userProfile}
            </p>
          </div>
        ) : currentStep < questions.length ? (
          <div
            className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="text-lg mb-6 text-center">
              {questions[currentStep].question}
            </div>
            <div className="flex flex-col space-y-4">
              {questions[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <h3 className="text-lg mb-6 text-center">
              Avaliação concluída! Por favor, revise suas respostas antes de
              enviar.
            </h3>
            <div className="mb-4">
              {questions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{`${index + 1}. ${
                    q.question
                  }`}</p>
                  <p>Sua resposta: {answers[index]}</p>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleReview(index)}
                  >
                    Alterar resposta
                  </button>
                </div>
              ))}
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full mb-2"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? "Enviando..." : "Enviar Respostas"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluateProfile;
