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

const extractQuestions = (text: string): Question[] => {
  const regex = /\d+\.\s(.+?)\n(Sim \/ Não)/g;
  const matches = [...text.matchAll(regex)];

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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await getFinancialLevelQuestions();
        const extractedQuestions = extractQuestions(response);
        setQuestions(extractedQuestions);
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
    setAnswers([...answers, answer]);
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      await evaluateFinancialLevel(questions, answers);
      alert("Avaliação de perfil concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      alert("Erro ao enviar respostas.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-grow bg-gray-200 p-4 sm:p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Avaliação de Perfil Financeiro
        </h2>
        {loading ? (
          <div className="text-center">
            <h2 className="text-xl font-bold">Carregando perguntas...</h2>
          </div>
        ) : currentStep < questions.length ? (
          <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
            <h3 className="text-lg mb-6">Avaliação concluída! Obrigado!</h3>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
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
