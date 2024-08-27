import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Token não encontrado.");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send("Token inválido.");
  }
};
