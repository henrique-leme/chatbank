import { useEffect, useState } from "react";
import {
  getFinancialLevelQuestions,
  evaluateFinancialLevel,
  EvaluationQuestion,
  EvaluationAnswer,
} from "../api/apiRoutes";
import Sidebar from "../components/SideBar";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAuth } from "../context/AuthContext";

type AnswerOption = "Sim" | "Não" | "Não Sei";

const EvaluateProfile = () => {
  const { user } = useAuth();
  const { trackUserError, trackProfileEvaluation } = useAnalytics();
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [options, setOptions] = useState<readonly string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerOption>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await getFinancialLevelQuestions();
        setQuestions(response.questions);
        setOptions(response.options);
        setCurrentStep(0);
        setAnswers(new Map());
      } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        trackUserError("questions_load_error", String(error));
        alert("Erro ao carregar perguntas, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (answer: AnswerOption) => {
    const currentQuestion = questions[currentStep];
    const updatedAnswers = new Map(answers);
    updatedAnswers.set(currentQuestion.id, answer);
    setAnswers(updatedAnswers);
    setCurrentStep(currentStep + 1);
  };

  const handleReview = (index: number) => {
    setCurrentStep(index);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      // Converter Map para array de EvaluationAnswer
      const answersArray: EvaluationAnswer[] = Array.from(answers.entries()).map(
        ([questionId, answer]) => ({ questionId, answer })
      );

      const response = await evaluateFinancialLevel(answersArray);
      setUserProfile(response.profileType === "advanced" ? "Avançado" : "Básico");

      // Rastrear avaliação de perfil
      if (user) {
        trackProfileEvaluation(user.uid, 'financial_level', response.score.simCount);
      }
    } catch (error) {
      console.error("Erro ao enviar respostas:", error);
      trackUserError("evaluation_submit_error", String(error));
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
            <h3 className="text-lg mb-6">Avaliação concluída!</h3>
            <p className="text-xl font-bold mb-4">
              Seu perfil financeiro é: {userProfile}
            </p>
            <p className="text-gray-600 mt-4">
              Agora você pode acessar o chat e receber orientações personalizadas de acordo com seu perfil.
            </p>
          </div>
        ) : currentStep < questions.length ? (
          <div
            className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="text-sm text-gray-500 mb-2 text-center">
              Pergunta {currentStep + 1} de {questions.length}
            </div>
            <div className="text-xs text-blue-600 mb-4 text-center">
              {questions[currentStep].dimension}
            </div>
            <div className="text-lg mb-6 text-center">
              {questions[currentStep].question}
            </div>
            <div className="flex flex-col space-y-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`font-semibold py-2 px-4 rounded w-full ${
                    option === "Sim"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : option === "Não"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                  onClick={() => handleAnswer(option as AnswerOption)}
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
                <div key={q.id} className="mb-4">
                  <p className="text-xs text-blue-600">{q.dimension}</p>
                  <p className="font-semibold">{`${index + 1}. ${q.question}`}</p>
                  <p>Sua resposta: {answers.get(q.id) || "Não respondida"}</p>
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
