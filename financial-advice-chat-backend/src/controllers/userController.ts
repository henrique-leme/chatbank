import { Request, Response } from "express";
import {
  getUserById,
  createUser,
  updateUserById,
  getAllUsers,
  deleteUserByEmail,
  getUserByEmail,
  updateUserProfileType,
} from "../services/userService";
import {
  userInputSchema,
  userSchema,
  userUpdateSchema,
} from "../models/userSchema";
import { z } from "zod";
import { INVERTED_QUESTION_IDS } from "../constants/evaluationQuestions";

export const getUserProfile = async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  try {
    const user = await getUserById(uid);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Usuário não encontrado.");
    }
  } catch (error) {
    res.status(500).send("Erro ao buscar o perfil do usuário.");
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  try {
    const userData = { ...req.body, id: uid };
    userUpdateSchema.parse(userData);
    await updateUserById(uid, userData);
    res.send("Perfil atualizado com sucesso.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors);
    }
    res.status(500).send("Erro ao atualizar o perfil.");
  }
};

export const createUserProfile = async (req: Request, res: Response) => {
  console.log("Criando usuário...");
  try {
    const userData = userInputSchema.parse(req.body);
    await createUser(userData);
    res.status(201).send("Usuário criado com sucesso.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors);
    }
    if (
      error instanceof Error &&
      error.message === "Já existe um usuário com este email."
    ) {
      return res.status(409).send(error.message);
    }
    res.status(500).send("Erro ao criar o usuário.");
  }
};

export const getAllUserProfiles = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404).send("Nenhum usuário encontrado.");
    }
  } catch (error) {
    res.status(500).send("Erro ao buscar todos os perfis de usuário.");
  }
};

export const findUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send("Email é obrigatório.");
    }
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Usuário não encontrado.");
    }
  } catch (error) {
    res.status(500).send("Erro ao buscar o perfil do usuário.");
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send("Email é obrigatório.");
    }
    await deleteUserByEmail(email);
    res.send(`Usuário com email ${email} deletado com sucesso.`);
  } catch (error) {
    res.status(500).send("Erro ao deletar o usuário.");
  }
};

interface EvaluationAnswer {
  questionId: number;
  answer: "Sim" | "Não" | "Não Sei";
}

export const evaluateFinancialLevel = async (req: Request, res: Response) => {
  const userId = (req as any).user.uid;

  try {
    const { answers } = req.body as { answers: EvaluationAnswer[] };

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).send("Respostas são obrigatórias.");
    }

    // Filtrar respostas validas (excluir "Não Sei")
    const validAnswers = answers.filter(a => a.answer !== "Não Sei");

    // Contar respostas "Sim" considerando perguntas invertidas
    const simCount = validAnswers.filter(a => {
      const isInverted = INVERTED_QUESTION_IDS.includes(a.questionId);
      // Para perguntas invertidas, "Não" conta como positivo
      if (isInverted) {
        return a.answer === "Não";
      }
      return a.answer === "Sim";
    }).length;

    const totalValid = validAnswers.length;

    // Calcular percentual (evitar divisao por zero)
    const percentage = totalValid > 0 ? (simCount / totalValid) * 100 : 0;

    // Classificar: >= 50% = advanced, < 50% = basic
    const profileType = percentage >= 50 ? "advanced" : "basic";

    await updateUserProfileType(userId, profileType);

    res.json({
      profileType,
      score: {
        simCount,
        totalAnswered: totalValid,
        percentage: Math.round(percentage)
      }
    });
  } catch (error) {
    res.status(500).send(`Erro ao avaliar o nível financeiro: ${error}`);
  }
};
