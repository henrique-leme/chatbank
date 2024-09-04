import { db } from "../config/firebase";
import { User, userSchema } from "../models/userSchema";

export const getUserById = async (uid: string): Promise<User | null> => {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists ? (userDoc.data() as User) : null;
};

export const createUser = async (userData: any): Promise<void> => {
  const user = userSchema.parse(userData);

  await db.collection("users").doc(user.id).set(user);
};
