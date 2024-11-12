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
  timeout = 600000
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("A requisição expirou.")), timeout)
    ),
  ]);
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("Content-Type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    const errorMessage = data || "Ocorreu um erro na requisição.";
    throw new Error(errorMessage);
  }

  return data;
};

/**
 * Realiza o login do usuário.
 * @param credentials Credenciais de login (email e senha).
 * @returns Resposta do backend contendo o token e informações do usuário.
 */
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

    const data: BackendLoginResponse = await handleResponse(response);

    console.log("Custom Token Recebido do Backend:", data.token);
    const authResponse = await signInWithCustomToken(auth, data.token);
    console.log("Token Gerado pelo Front SDK:", authResponse.user.getIdToken());

    data.token = await authResponse.user.getIdToken();

    return data;
  } catch (error: any) {
    console.error("Erro durante o login:", error);
    throw new Error(error.message || "Erro desconhecido durante o login.");
  }
};

/**
 * Registra um novo usuário.
 * @param data Dados de registro do usuário.
 */
export const registerUser = async (data: RegisterData): Promise<void> => {
  const url = `${backendUrl}/users/register`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    await handleResponse(response);

    await loginUser({ email: data.email, password: data.password });
  } catch (error: any) {
    console.error("Erro durante o registro:", error);
    throw new Error(error.message || "Erro desconhecido durante o registro.");
  }
};

/**
 * Recupera o histórico de chat do usuário.
 * @returns Objeto Chat contendo o histórico.
 */
export const getChatHistory = async (): Promise<Chat> => {
  const url = `${backendUrl}/chat/history`;

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o chatHistory:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: Chat = await handleResponse(response);

    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      messages: data.messages.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      })),
    };
  } catch (error: any) {
    console.error("Erro ao buscar histórico de chat:", error);
    throw new Error(
      error.message || "Erro desconhecido ao buscar histórico de chat."
    );
  }
};

/**
 * Envia uma mensagem no chat financeiro.
 * @param question A pergunta a ser enviada.
 * @returns Resposta da mensagem enviada.
 */
export const sendMessage = async (
  question: string
): Promise<SendMessageResponse> => {
  const url = `${backendUrl}/chat/message/finance`;

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o sendMessage:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    const data: SendMessageResponse = await handleResponse(response);
    return data;
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    throw new Error(error.message || "Erro desconhecido ao enviar mensagem.");
  }
};

/**
 * Recupera o perfil do usuário.
 * @param uid ID do usuário.
 * @returns Perfil do usuário.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const url = `${backendUrl}/users/details`;

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o getUserProfile:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userProfile: UserProfile = await handleResponse(response);
    return {
      ...userProfile,
      createdAt: new Date(userProfile.createdAt),
      updatedAt: userProfile.updatedAt
        ? new Date(userProfile.updatedAt)
        : undefined,
    };
  } catch (error: any) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw new Error(
      error.message || "Erro desconhecido ao buscar perfil do usuário."
    );
  }
};

/**
 * Recupera as perguntas de nível financeiro.
 * @returns Perguntas de nível financeiro.
 */
export const getFinancialLevelQuestions = async (): Promise<string> => {
  const url = `${backendUrl}/chat/questions/llama`;

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o getFinancialLevelQuestions:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    const questions: string = data.questions;
    return questions;
  } catch (error: any) {
    console.error("Erro ao buscar perguntas financeiras:", error);
    throw new Error(
      error.message || "Erro desconhecido ao buscar perguntas financeiras."
    );
  }
};

/**
 * Avalia o nível financeiro do usuário com base nas respostas.
 * @param questions Lista de perguntas.
 * @param answers Lista de respostas correspondentes.
 * @returns Objeto contendo o tipo de perfil e a resposta da AI.
 */
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
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o evaluateFinancialLevel:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await handleResponse(response);
    return data;
  } catch (error: any) {
    console.error("Erro ao avaliar o nível financeiro:", error);
    throw new Error(
      error.message || "Erro desconhecido ao avaliar o nível financeiro."
    );
  }
};

/**
 * Atualiza o perfil do usuário.
 * @param uid ID do usuário.
 * @param data Dados parciais para atualizar o perfil.
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<RegisterData>
): Promise<void> => {
  const url = `${backendUrl}/users/details`;

  try {
    const token = await auth.currentUser?.getIdToken();
    console.log("Token usado para o updateUserProfile:", token);
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    await handleResponse(response);
  } catch (error: any) {
    console.error("Erro ao atualizar o perfil do usuário:", error);
    throw new Error(
      error.message || "Erro desconhecido ao atualizar o perfil do usuário."
    );
  }
};

/**
 * Adiciona uma mensagem financeira no chat.
 * @param question A pergunta a ser adicionada.
 * @returns Resposta da mensagem enviada.
 */
export const addChatMessageFinance = async (
  question: string
): Promise<SendMessageResponse> => {
  const url = `${backendUrl}/chat/message/finance`;

  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    const data: SendMessageResponse = await handleResponse(response);
    return data;
  } catch (error: any) {
    console.error("Erro ao enviar mensagem financeira:", error);
    throw new Error(
      error.message || "Erro desconhecido ao enviar mensagem financeira."
    );
  }
};
