import { z } from "zod";
import firebase from "firebase-admin";

const firestoreTimestampToDate = z.preprocess((arg) => {
  if (arg instanceof firebase.firestore.Timestamp) {
    return arg.toDate();
  }
  return arg;
}, z.date());

export const chatMessageSchema = z.object({
  question: z.string().min(1, "Pergunta não pode ser vazia"),
  answer: z.string().min(1, "Resposta não pode ser vazia"),
  createdAt: firestoreTimestampToDate,
});

export const chatSchema = z.object({
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
  profileType: z.enum(["basic", "advanced"]),
  messages: z.array(chatMessageSchema),
  createdAt: firestoreTimestampToDate,
  updatedAt: firestoreTimestampToDate.optional(),
});

export type Chat = z.infer<typeof chatSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
