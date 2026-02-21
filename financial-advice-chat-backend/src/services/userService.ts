import { db } from "../config/firebase";
import { User, userSchema, userUpdateSchema } from "../models/userSchema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const getUserById = async (uid: string): Promise<User | null> => {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists ? (userDoc.data() as User) : null;
};

export const createUser = async (userData: any): Promise<void> => {
  userData.id = uuidv4();
  userData.createdAt = new Date();
  const user = userSchema.parse(userData);

  const existingUser = await db
    .collection("users")
    .where("email", "==", user.email)
    .get();

  if (!existingUser.empty) {
    throw new Error("Já existe um usuário com este email.");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userToSave = {
    ...user,
    password: hashedPassword,
  };

  await db.collection("users").doc(userData.id).set(userToSave);
};

export const updateUserById = async (
  uid: string,
  userData: any
): Promise<void> => {
  const user = userUpdateSchema.parse(userData);

  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }

  const userToUpdate = {
    ...user,
    updatedAt: new Date(),
  };

  await db.collection("users").doc(uid).update(userToUpdate);
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersSnapshot = await db.collection("users").get();
  return usersSnapshot.docs.map((doc) => doc.data() as User);
};

export const deleteUserByEmail = async (email: string): Promise<void> => {
  const userSnapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  if (!userSnapshot.empty) {
    const batch = db.batch();
    userSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  } else {
    throw new Error("Usuário com este email não encontrado.");
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userSnapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshot.empty) {
    return null;
  }

  const userDoc = userSnapshot.docs[0];
  return userDoc.exists ? (userDoc.data() as User) : null;
};

export const updateUserProfileType = async (
  uid: string,
  profileType: "basic" | "advanced"
): Promise<void> => {
  const updateData = { profileType };

  const userToUpdate = userUpdateSchema.parse(updateData);

  await db
    .collection("users")
    .doc(uid)
    .update({
      ...userToUpdate,
      updatedAt: new Date(),
    });
};
