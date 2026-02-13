import axios from "axios";
import { db } from "../config/firebase";
import { chatSchema, Chat, ChatMessage } from "../models/chatSchema";
import { translateTextToPortuguese } from "../services/translationService";
import { getUserById } from "./userService";
import firebase from "firebase-admin";

// Interface para mensagens do Ollama (padrão OpenAI-like)
interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Contexto do usuário para personalização
export interface UserContext {
  profileType: string;
  income: number;
  userId: string;
}

// Configuração da API do Ollama
const OLLAMA_API_URL = "https://conversafina.ddnsfree.com/ollama/api/chat";
const FINANCE_MODEL = "0xroyce/Plutus-3B";
const LLAMA_MODEL = "llama3.2:1b";

// System prompt para o assistente financeiro
const getFinanceSystemPrompt = (context: UserContext): string => {
  const profileDescription = context.profileType === "advanced"
    ? "avançado (possui conhecimentos financeiros sólidos)"
    : "básico (está aprendendo sobre finanças)";

  return `Você é um assistente financeiro especializado em educação financeira para brasileiros.

CONTEXTO DO USUÁRIO:
- Perfil financeiro: ${profileDescription}
- Renda mensal: R$ ${context.income.toLocaleString('pt-BR')}

INSTRUÇÕES:
1. Responda APENAS a pergunta atual do usuário
2. Use linguagem ${context.profileType === "advanced" ? "técnica quando apropriado" : "simples e didática"}
3. Dê exemplos práticos relacionados à realidade brasileira
4. Seja objetivo e direto nas respostas
5. Não mencione conversas de outros usuários
6. Cada conversa é independente e isolada

IMPORTANTE: Você está respondendo apenas para este usuário específico. Ignore qualquer contexto de conversas anteriores que não esteja explicitamente incluído nas mensagens.`;
};

export const processLlamaModel = async (question: string): Promise<string> => {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: LLAMA_MODEL,
      messages: [{ role: "user", content: question }],
      stream: false,
    });
    return response.data.message.content.trim();
  } catch (error) {
    console.error("Erro ao chamar o LLM:", error);
    throw new Error("Falha ao conectar ao serviço de LLM.");
  }
};

const isPortuguese = (text: string): boolean => {
  const portugueseWords = [
    'você', 'não', 'são', 'está', 'esse', 'essa', 'isso', 'como', 'para',
    'que', 'uma', 'seu', 'sua', 'mais', 'também', 'pode', 'deve', 'fazer',
    'dinheiro', 'investimento', 'financeiro', 'renda', 'conta', 'banco',
    'quando', 'porque', 'então', 'ainda', 'pelo', 'pela', 'seus', 'suas',
    'sobre', 'após', 'entre', 'cada', 'muito', 'outro', 'outra', 'mesmo'
  ];

  const lowerText = text.toLowerCase();
  const matches = portugueseWords.filter(word => lowerText.includes(word));

  // Se tiver 3+ palavras portuguesas, considera portugues
  return matches.length >= 3;
};

/**
 * Converte histórico de chat para formato de mensagens do Ollama
 */
const buildConversationHistory = (
  chatHistory: ChatMessage[],
  maxMessages: number = 10
): OllamaMessage[] => {
  // Pegar apenas as últimas N mensagens para não exceder limite de contexto
  const recentMessages = chatHistory.slice(-maxMessages);

  const messages: OllamaMessage[] = [];

  for (const msg of recentMessages) {
    messages.push({ role: "user", content: msg.question });
    messages.push({ role: "assistant", content: msg.answer });
  }

  return messages;
};

/**
 * Processa mensagem usando o modelo financeiro com contexto isolado por usuário
 *
 * @param question - Pergunta atual do usuário
 * @param userContext - Contexto do usuário (perfil, renda, id)
 * @param chatHistory - Histórico de mensagens do usuário (opcional)
 */
export const processFinanceModel = async (
  question: string,
  userContext: UserContext,
  chatHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    // Construir array de mensagens com contexto isolado
    const messages: OllamaMessage[] = [
      // System prompt com contexto do usuário
      {
        role: "system",
        content: getFinanceSystemPrompt(userContext)
      }
    ];

    // Adicionar histórico de conversa do usuário (se houver)
    if (chatHistory.length > 0) {
      const historyMessages = buildConversationHistory(chatHistory);
      messages.push(...historyMessages);
    }

    // Adicionar pergunta atual
    messages.push({
      role: "user",
      content: question
    });

    console.log(`[${userContext.userId}] Enviando ${messages.length} mensagens para o modelo`);

    const response = await axios.post(OLLAMA_API_URL, {
      model: FINANCE_MODEL,
      messages,
      stream: false,
      // Opções para garantir respostas consistentes
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    const aiResponse = response.data.message.content.trim();

    console.log(`[${userContext.userId}] Resposta recebida (${aiResponse.length} chars)`);

    // Detectar se já está em português
    if (isPortuguese(aiResponse)) {
      console.log(`[${userContext.userId}] Resposta em português, pulando tradução`);
      return aiResponse;
    }

    console.log(`[${userContext.userId}] Resposta em inglês, traduzindo para português`);
    const translatedResponse = await translateTextToPortuguese(aiResponse);

    return translatedResponse;
  } catch (error) {
    console.error(`[${userContext.userId}] Erro ao chamar o modelo:`, error);
    throw new Error("Falha ao conectar ao serviço de LLM.");
  }
};

/**
 * @deprecated Use processFinanceModel com contexto estruturado
 * Mantido para compatibilidade, mas não deve ser usado em novas implementações
 */
export const processFinanceModelLegacy = async (
  question: string
): Promise<string> => {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: FINANCE_MODEL,
      messages: [{ role: "user", content: question }],
      stream: false,
    });

    const aiResponse = response.data.message.content.trim();

    if (isPortuguese(aiResponse)) {
      return aiResponse;
    }

    const translatedResponse = await translateTextToPortuguese(aiResponse);
    return translatedResponse;
  } catch (error) {
    console.error("Erro ao chamar o modelo:", error);
    throw new Error("Falha ao conectar ao serviço de LLM.");
  }
};

export const addMessageToChat = async (
  userId: string,
  question: string,
  answer: string
): Promise<void> => {
  const chatDoc = await db.collection("chats").doc(userId).get();

  let chat: Chat;

  if (!chatDoc.exists) {
    console.log("Chat não encontrado, criando um novo chat para o usuário...");

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    chat = {
      chatId: userId,
      userId: userId,
      profileType: user.profileType || "basic",
      messages: [],
      createdAt: firebase.firestore.Timestamp.now().toDate(), // Corrigido para Timestamp
      updatedAt: firebase.firestore.Timestamp.now().toDate(), // Corrigido para Timestamp
    };

    await db.collection("chats").doc(userId).set(chat);
  } else {
    const chatData = chatDoc.data();

    if (
      !chatData?.chatId ||
      !chatData?.userId ||
      !chatData?.profileType ||
      !chatData?.createdAt
    ) {
      throw new Error(
        "Chat existente está incompleto. Verifique os campos obrigatórios."
      );
    }

    chat = chatSchema.parse(chatData);
  }

  const newMessage: ChatMessage = {
    question,
    answer,
    createdAt: firebase.firestore.Timestamp.now().toDate(),
  };

  chat.messages.push(newMessage);
  chat.updatedAt = firebase.firestore.Timestamp.now().toDate();
  await db.collection("chats").doc(userId).update(chat);
};

export const getChatByUserId = async (
  userId: string,
  limit: number,
  startAfter: string | null
): Promise<{ messages: ChatMessage[]; nextPageToken: string | null }> => {
  const chatDoc = await db.collection("chats").doc(userId).get();

  if (!chatDoc.exists) {
    return { messages: [], nextPageToken: null };
  }

  const chatData = chatDoc.data();

  if (
    !chatData?.chatId ||
    !chatData?.userId ||
    !chatData?.profileType ||
    !chatData?.createdAt
  ) {
    throw new Error(
      "Chat existente está incompleto. Verifique os campos obrigatórios."
    );
  }

  const messages = chatData.messages || [];

  const messagesWithIsoDates = messages.map((msg: ChatMessage) => {
    let createdAtDate: Date;

    if (msg.createdAt instanceof firebase.firestore.Timestamp) {
      createdAtDate = msg.createdAt.toDate();
    } else if (typeof msg.createdAt === "string") {
      createdAtDate = new Date(msg.createdAt);
    } else if (
      (msg.createdAt as { _seconds?: number; _nanoseconds?: number })
        ._seconds !== undefined &&
      (msg.createdAt as { _seconds?: number; _nanoseconds?: number })
        ._nanoseconds !== undefined
    ) {
      const { _seconds, _nanoseconds } = msg.createdAt as unknown as {
        _seconds: number;
        _nanoseconds: number;
      };
      createdAtDate = new Date(_seconds * 1000 + _nanoseconds / 1e6);
    } else {
      createdAtDate = new Date();
    }

    return {
      ...msg,
      createdAt: createdAtDate.toISOString(),
    };
  });

  const sortedMessages = messagesWithIsoDates.sort(
    (a: ChatMessage, b: ChatMessage) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let paginatedMessages;
  if (startAfter) {
    const startIndex = sortedMessages.findIndex(
      (msg: ChatMessage) => new Date(msg.createdAt).toISOString() === startAfter
    );
    paginatedMessages = sortedMessages.slice(
      startIndex + 1,
      startIndex + 1 + limit
    );
  } else {
    paginatedMessages = sortedMessages.slice(0, limit);
  }

  const nextPageToken =
    paginatedMessages.length === limit
      ? paginatedMessages[paginatedMessages.length - 1].createdAt
      : null;

  return { messages: paginatedMessages, nextPageToken };
};