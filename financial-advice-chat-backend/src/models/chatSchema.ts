import { z } from "zod";

export const chatMessageSchema = z.object({
  question: z.string().min(1, "Pergunta não pode ser vazia"),
  answer: z.string().min(1, "Resposta não pode ser vazia"),
  createdAt: z.date(),
});

export const chatSchema = z.object({
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
  profileType: z.enum(["basic", "advanced"]),
  messages: z.array(chatMessageSchema),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Chat = z.infer<typeof chatSchema>;
