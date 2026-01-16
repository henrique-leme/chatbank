import { Request, Response } from "express";
import {
  addMessageToChat,
  getChatByUserId,
  processFinanceModel,
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

    const limit = 5;

    const chatHistory = await getChatByUserId(userId, limit, null);

    let context = `Estas são as últimas 5 perguntas feitas por mim, que tenho um perfil financeiro "${profileType}" e ganhos mensais de R$${income}:\n`;
    if (chatHistory && chatHistory.messages.length > 0) {
      const lastFiveQuestions = chatHistory.messages
        .map((message) => `Pergunta: ${message.question}`)
        .join("\n");

      context += lastFiveQuestions;
    } else {
      context += "Nenhum histórico disponível.\n";
    }

    context += `\nE esta é a pergunta feita agora por mim: ${question}. Responda de forma clara e objetiva apenas a ultima pergunta feita, levando em conta o que já foi perguntado, elabore a resposta de acordo com o nível informado do usuário.`;

    console.log(context);

    const aiResponse = await processFinanceModel(context);
    console.log("Realizou a chamada para a IA");

    await addMessageToChat(userId, question, aiResponse);

    res.json({ answer: aiResponse });
  } catch (error) {
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
