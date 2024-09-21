import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { z } from "zod";

const envSchema = z.object({
  REACT_APP_FIREBASE_API_KEY: z.string().nonempty("API Key é obrigatória"),
  REACT_APP_FIREBASE_AUTH_DOMAIN: z
    .string()
    .nonempty("Auth Domain é obrigatório"),
  REACT_APP_FIREBASE_DATABASE_URL: z.string().optional(),
  REACT_APP_FIREBASE_PROJECT_ID: z
    .string()
    .nonempty("Project ID é obrigatório"),
  REACT_APP_FIREBASE_STORAGE_BUCKET: z
    .string()
    .nonempty("Storage Bucket é obrigatório"),
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .nonempty("Messaging Sender ID é obrigatório"),
  REACT_APP_FIREBASE_APP_ID: z.string().nonempty("App ID é obrigatório"),
  REACT_APP_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "Erro na validação das variáveis de ambiente:",
    env.error.format()
  );
  throw new Error("Configuração do Firebase inválida");
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
