import * as admin from "firebase-admin";
import * as serviceAccount from "../config/adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://financial-advice-chat-default-rtdb.firebaseio.com",
});

export const db = admin.firestore();
export const auth = admin.auth();
