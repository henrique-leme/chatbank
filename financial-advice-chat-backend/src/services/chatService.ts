import { db } from "../config/firebase";
import { chatSchema, Chat } from "../models/chatSchema";

export const getChatByUserId = async (userId: string): Promise<Chat | null> => {
  const chatDoc = await db.collection("chats").doc(userId).get();
  return chatDoc.exists ? (chatDoc.data() as Chat) : null;
};

export const createChat = async (chatData: any): Promise<void> => {
  const chat = chatSchema.parse(chatData); // Validação com Zod
  await db.collection("chats").doc(chat.userId).set(chat);
};

export const addMessageToChat = async (
  userId: string,
  messageData: any
): Promise<void> => {
  const chatDoc = await db.collection("chats").doc(userId).get();
  if (!chatDoc.exists) throw new Error("Chat não encontrado.");

  const chat = chatSchema.parse(chatDoc.data());

  // Adiciona a nova mensagem ao array de mensagens
  chat.messages.push({
    ...messageData,
    createdAt: new Date(),
  });

  chat.updatedAt = new Date();

  // Atualiza o chat no Firestore
  await db.collection("chats").doc(userId).update(chat);
};
