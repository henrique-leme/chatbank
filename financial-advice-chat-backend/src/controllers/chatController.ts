import { Request, Response } from "express";
import {
  addMessageToChat,
  getChatByUserId,
  processFinanceModel,
  processLlamaModel,
} from "../services/chatService";
import { getUserById } from "../services/userService";

export const getFinancialLevelQuestions = async (
  req: Request,
  res: Response
) => {
  try {
    const prompt = `Elabore 6 perguntas de forma enumerada, para poder avaliar se o nível de conhecimento financeiro no Brasil de uma pessoa é básico ou avançado, as perguntas devem ser de Sim e Não`;

    const aiResponse = await processLlamaModel(prompt);

    res.json({ questions: aiResponse });
  } catch (error) {
    res.status(500).send(`Erro ao gerar perguntas: ${error}`);
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

    let context = `Esse é o Histórico das últimas perguntas do usuário com o perfil "${profileType}" e ganhos mensais de R$${income}:\n`;
    if (chatHistory && chatHistory.messages.length > 0) {
      const lastFiveQuestions = chatHistory.messages
        .map((message) => `Pergunta: ${message.question}`)
        .join("\n");

      context += lastFiveQuestions;
    } else {
      context += "Nenhum histórico disponível.\n";
    }

    context += `\nE esta é a pergunta atual do usuário: ${question}. Responda de forma clara e objetiva, levando em conta o que já foi perguntado, elabore a resposta de acordo com o nível informado do usuário.`;

    console.log(context);

    const aiResponse = await processFinanceModel(context);

    await addMessageToChat(userId, question, aiResponse);

    res.json({ answer: aiResponse });
  } catch (error) {
    res.status(500).send(`Erro ao adicionar mensagem ao chat: ${error}`);
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;
  const { limit = 10, startAfter } = req.query;

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
