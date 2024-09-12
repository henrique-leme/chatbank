import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  JWT_SECRET: z.string().nonempty("JWT_SECRET é obrigatório"),
  DEEPL_API_KEY: z.string().nonempty("DEEPL_API_KEY é obrigatória"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "Erro na validação das variáveis de ambiente:",
    env.error.format()
  );
  throw new Error("Configuração inválida");
}

export const config = {
  jwtSecret: process.env.JWT_SECRET as string,
  deeplApiKey: process.env.DEEPL_API_KEY as string,
};
