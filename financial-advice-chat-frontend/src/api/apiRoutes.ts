import { auth } from "../firebase";
import { signInWithCustomToken } from "firebase/auth";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

if (!backendUrl) {
  throw new Error(
    "A URL do backend não está definida nas variáveis de ambiente."
  );
}

console.log("URL do backend:", backendUrl);

interface LoginCredentials {
  email: string;
  password: string;
}

interface BackendLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    secondName: string;
    email: string;
    age: number;
    income: number;
    profileType: "basic" | "advanced";
    createdAt: { _seconds: number; _nanoseconds: number };
    password: string;
  };
}

export interface RegisterData {
  name: string;
  secondName: string;
  email: string;
  password: string;
  age: number;
  income: number;
  profileType: "basic" | "advanced";
}

interface ChatMessage {
  question: string;
  answer: string;
  createdAt: Date;
}

type Question = {
  question: string;
  options: string[];
};

interface Chat {
  chatId: string;
  userId: string;
  profileType: "basic" | "advanced";
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt?: Date;
}

interface SendMessageResponse {
  answer: string;
  success: boolean;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  secondName: string;
  email: string;
  age: number;
  income: number;
  profileType: "basic" | "advanced";
  createdAt: Date;
  updatedAt?: Date;
}

const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout = 800000
) => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("A requisição expirou.")), timeout)
    ),
  ]);
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<BackendLoginResponse> => {
  const url = `${backendUrl}/users/login`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || "Falha ao logar no backend.";
      throw new Error(errorMessage);
    }

    const data: BackendLoginResponse = await response.json();

    await signInWithCustomToken(auth, data.token);
    return data;
  } catch (error) {
    console.error("Erro durante o login:", error);
    throw error;
  }
};

export const registerUser = async (data: RegisterData): Promise<void> => {
  const url = `${backendUrl}/users/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      throw new Error("Falha ao registrar usuário no backend.");
    }

    await loginUser({ email: data.email, password: data.password });
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const getChatHistory = async (): Promise<Chat> => {
  const url = `${backendUrl}/chat/history`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Falha ao recuperar o histórico de chat.";
      throw new Error(errorMessage);
    }

    const data: Chat = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      messages: data.messages.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar histórico de chat:", error);
    throw error;
  }
};

export const sendMessage = async (
  question: string
): Promise<SendMessageResponse> => {
  const url = `${backendUrl}/chat/message/finance`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || "Falha ao enviar a mensagem.";
      throw new Error(errorMessage);
    }

    const data: SendMessageResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const url = `${backendUrl}/users/details`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Falha ao recuperar o perfil do usuário.";
      throw new Error(errorMessage);
    }

    const userProfile: UserProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

export const getFinancialLevelQuestions = async (): Promise<string> => {
  const url = `${backendUrl}/chat/questions/llama`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || "Falha ao buscar perguntas.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const questions: string = data.questions;
    return questions;
  } catch (error) {
    console.error("Erro ao buscar perguntas financeiras:", error);
    throw error;
  }
};

export const evaluateFinancialLevel = async (
  questions: Question[],
  answers: string[]
): Promise<{ profileType: string; aiResponse: string }> => {
  const url = `${backendUrl}/users/evaluate-finance-level/llama`;

  const formattedQuestionsAndAnswers = questions
    .map(
      (question, index) =>
        `${index + 1}. ${question.question} Resposta: ${answers[index]}`
    )
    .join("\n");

  const prompt = `${formattedQuestionsAndAnswers} Baseado nas respostas, avalie em básico ou avançado e responda apenas com o nível da pessoa e mais nada.`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Falha ao avaliar o nível financeiro.";
      throw new Error(errorMessage);
    }

    // Parse da resposta da API
    const data = await response.json();
    return data; // Supondo que data é um objeto com "profileType" e "aiResponse"
  } catch (error) {
    console.error("Erro ao avaliar o nível financeiro:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<RegisterData>
): Promise<void> => {
  const url = `${backendUrl}/users/details`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Falha ao atualizar o perfil do usuário.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Erro ao atualizar o perfil do usuário:", error);
    throw error;
  }
};

export const addChatMessageFinance = async (
  question: string
): Promise<SendMessageResponse> => {
  const url = `${backendUrl}/chat/message/finance`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Falha ao enviar a mensagem financeira.";
      throw new Error(errorMessage);
    }

    const data: SendMessageResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem financeira:", error);
    throw error;
  }
};
