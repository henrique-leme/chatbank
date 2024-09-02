import { Request, Response } from "express";
import { getChatByUserId, addMessageToChat } from "../services/chatService";
import { chatMessageSchema } from "../models/chatSchema";
import { z } from "zod";

export const getChatHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;
  const chat = await getChatByUserId(userId);
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).send("Histórico de chat não encontrado.");
  }
};

export const addChatMessage = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;

  try {
    const messageData = chatMessageSchema.parse(req.body);
    await addMessageToChat(userId, messageData);
    res.send("Mensagem adicionada com sucesso.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors);
    }
    res.status(500).send("Erro ao adicionar mensagem ao chat.");
  }
};
