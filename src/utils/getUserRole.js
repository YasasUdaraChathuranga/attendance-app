import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getUserRole = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().role;
  }

  return "user";
};