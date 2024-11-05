import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import { decode } from "punycode";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rawToken = req.headers.authorization?.split(" ")[1] || "";
  const token = rawToken.trim();

  if (!token) {
    return res.status(401).send("Acesso negado. Token não fornecido.");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
};
