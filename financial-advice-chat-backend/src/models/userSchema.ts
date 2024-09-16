import { z } from "zod";

export const userInputSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  secondName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  age: z.number().int().min(0, "Idade deve ser um número inteiro positivo"),
  income: z.number().nonnegative("Renda deve ser um valor positivo"),
  profileType: z.enum(["basic", "advanced"]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  secondName: z.string().min(1, "Sobrenome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .optional(),
  age: z
    .number()
    .int()
    .min(0, "Idade deve ser um número inteiro positivo")
    .optional(),
  income: z.number().nonnegative("Renda deve ser um valor positivo").optional(),
  profileType: z.enum(["basic", "advanced"]).optional(),
});

export const userSchema = z
  .object({
    id: z.string().uuid("Id deve ser um UUID válido"),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  })
  .merge(userInputSchema);

export type User = z.infer<typeof userSchema>;
