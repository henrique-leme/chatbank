import admin from "firebase-admin";

const serviceAccount = require("../path/to/serviceAccountKey.json"); // Certifique-se de configurar a chave correta do Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

const db = admin.firestore();
export { db };
