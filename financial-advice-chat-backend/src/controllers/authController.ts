import { Request, Response } from "express";
import { getUserByEmail } from "../services/userService";
import { comparePassword } from "../services/authService";
import admin from "firebase-admin";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Fazendo login...");
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

    console.log("Custom Token Gerado para Logar no Front SDK:", customToken);

    // Remover senha do objeto antes de retornar
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ token: customToken, user: userWithoutPassword });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send("Erro ao fazer login.");
  }
};
