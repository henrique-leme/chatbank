import { Request, Response } from "express";
import {
  addMessageToChat,
  getChatByUserId,
  processFinanceModel,
  UserContext,
} from "../services/chatService";
import { getUserById } from "../services/userService";
import { EVALUATION_QUESTIONS, QUESTION_OPTIONS } from "../constants/evaluationQuestions";

export const getFinancialLevelQuestions = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      questions: EVALUATION_QUESTIONS,
      options: QUESTION_OPTIONS
    });
  } catch (error) {
    res.status(500).send(`Erro ao buscar perguntas: ${error}`);
  }
};

export const addChatMessageFinance = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).send("Pergunta não pode ser vazia.");
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const { profileType, income } = user;

    // Buscar histórico de mensagens do usuário (últimas 5 para contexto)
    const chatHistory = await getChatByUserId(userId, 5, null);

    // Criar contexto isolado do usuário
    const userContext: UserContext = {
      profileType: profileType || "basic",
      income: income || 0,
      userId,
    };

    console.log(`[${userId}] Processando pergunta com contexto isolado`);

    // Processar com o modelo usando contexto estruturado
    const aiResponse = await processFinanceModel(
      question,
      userContext,
      chatHistory.messages
    );

    console.log(`[${userId}] Resposta gerada com sucesso`);

    // Salvar mensagem no histórico do usuário
    await addMessageToChat(userId, question, aiResponse);

    res.json({ answer: aiResponse });
  } catch (error) {
    console.error(`[${userId}] Erro ao processar mensagem:`, error);
    res.status(500).send(`Erro ao adicionar mensagem ao chat: ${error}`);
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;
  const { limit = 10, startAfter } = req.query;
  console.log("Realizou get de History");
  try {
    const chat = await getChatByUserId(
      userId,
      Number(limit),
      startAfter ? String(startAfter) : null
    );
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).send("Histórico de chat não encontrado.");
    }
  } catch (error) {
    res.status(500).send("Erro ao recuperar histórico de chat.");
  }
};
