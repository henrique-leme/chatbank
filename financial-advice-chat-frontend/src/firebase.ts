import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { z } from "zod";

const envSchema = z.object({
  REACT_APP_FIREBASE_API_KEY: z.string({
    required_error: "API Key é obrigatória",
    invalid_type_error: "API Key deve ser uma string",
  }),
  REACT_APP_FIREBASE_AUTH_DOMAIN: z.string({
    required_error: "Auth Domain é obrigatório",
    invalid_type_error: "Auth Domain deve ser uma string",
  }),
  REACT_APP_FIREBASE_DATABASE_URL: z.string().optional(),
  REACT_APP_FIREBASE_PROJECT_ID: z.string({
    required_error: "Project ID é obrigatório",
    invalid_type_error: "Project ID deve ser uma string",
  }),
  REACT_APP_FIREBASE_STORAGE_BUCKET: z.string({
    required_error: "Storage Bucket é obrigatório",
    invalid_type_error: "Storage Bucket deve ser uma string",
  }),
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: z.string({
    required_error: "Messaging Sender ID é obrigatório",
    invalid_type_error: "Messaging Sender ID deve ser uma string",
  }),
  REACT_APP_FIREBASE_APP_ID: z.string({
    required_error: "App ID é obrigatório",
    invalid_type_error: "App ID deve ser uma string",
  }),
  REACT_APP_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

function getValidatedEnvConfig(): EnvConfig {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error("❌ Erro na validação das variáveis de ambiente:");
    console.error(env.error.format());
    throw new Error(
      "Configuração do Firebase inválida - Verifique as variáveis de ambiente"
    );
  }

  return env.data;
}

// Função para criar a configuração do Firebase
function createFirebaseConfig(env: EnvConfig) {
  return {
    apiKey: env.REACT_APP_FIREBASE_API_KEY,
    authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_FIREBASE_APP_ID,
    measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
}

// Classe para gerenciar a inicialização do Firebase
class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private _auth: Auth;
  private _db: Firestore;

  private constructor() {
    try {
      const envConfig = getValidatedEnvConfig();
      const firebaseConfig = createFirebaseConfig(envConfig);

      this.app = initializeApp(firebaseConfig);
      this._auth = getAuth(this.app);
      this._db = getFirestore(this.app);

      console.info("✅ Firebase inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar Firebase:", error);
      throw error;
    }
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public get auth(): Auth {
    return this._auth;
  }

  public get db(): Firestore {
    return this._db;
  }
}

export const firebaseService = FirebaseService.getInstance();
export const auth = firebaseService.auth;
export const db = firebaseService.db;
