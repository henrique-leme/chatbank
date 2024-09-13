import { Request, Response } from "express";
import { getUserByEmail } from "../services/userService";
import { comparePassword } from "../services/authService";
import admin from "firebase-admin";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Senha incorreta.");
    }

    const customToken = await admin.auth().createCustomToken(user.id);

    res.status(200).json({ token: customToken, user });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send("Erro ao fazer login.");
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.status(200).send("Usuário deslogado com sucesso.");
  } catch (error) {
    res.status(500).send("Erro ao deslogar o usuário.");
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(404).send("Usuário não autenticado.");
  }

  res.status(200).json(user);
};
