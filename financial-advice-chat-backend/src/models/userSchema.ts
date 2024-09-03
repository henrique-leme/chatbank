import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  secondName: z.string().min(1, "Sobrenome é obrigatório"),
  age: z.number().int().min(0, "Idade deve ser positiva"),
  income: z.number().nonnegative("Renda deve ser um valor positivo"),
  profileType: z.enum(["basic", "advanced"]),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
