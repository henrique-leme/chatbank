import axios from "axios";
import { db } from "../config/firebase";
import { chatSchema, Chat, ChatMessage } from "../models/chatSchema";
import { translateTextToPortuguese } from "../services/translationService";
import { getUserById } from "./userService";
import firebase from "firebase-admin";

export const processLlamaModel = async (question: string): Promise<string> => {
  try {
    const response = await axios.post("https://conversafina.ddnsfree.com/ollama/api/chat", {
      model: "llama3.2:1b",
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

export const processFinanceModel = async (
  question: string
): Promise<string> => {
  try {
    const response = await axios.post("https://conversafina.ddnsfree.com/ollama/api/chat", {
      model: "0xroyce/Plutus-3B",
      messages: [{ role: "user", content: question }],
      stream: false,
    });
    console.log(response);

    const aiResponse = response.data.message.content.trim();

    // Detectar se ja esta em portugues
    if (isPortuguese(aiResponse)) {
      console.log("Resposta ja em portugues, pulando traducao");
      return aiResponse;
    }

    console.log("Resposta em ingles, traduzindo para portugues");
    const translatedResponse = await translateTextToPortuguese(aiResponse);

    return translatedResponse;
  } catch (error) {
    console.error("Erro ao chamar o modelo tim2nearfield/finance:", error);
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