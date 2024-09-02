import { Request, Response } from "express";
import { getUserById, createUser } from "../services/userService";
import { userSchema } from "../models/userSchema";
import { z } from "zod";

export const getUserProfile = async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  const user = await getUserById(uid);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("Usuário não encontrado.");
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;

  try {
    const userData = { ...req.body, id: uid };
    userSchema.parse(userData);
    await createUser(userData);
    res.send("Perfil atualizado com sucesso.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors);
    }
    res.status(500).send("Erro ao atualizar o perfil.");
  }
};
