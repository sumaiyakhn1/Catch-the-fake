// src/lib/saveScore.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export async function saveScore(user: User, score: number) {
  try {
    // Save current score to scores collection
    const scoresRef = collection(db, "scores");
    await addDoc(scoresRef, {
      uid: user.uid,
      name: user.displayName || user.email,
      score,
      createdAt: serverTimestamp(),
    });

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Update best score if higher
    const prevBest = userSnap.exists() ? userSnap.data()?.bestScore || 0 : 0;
    if (score > prevBest) {
      await setDoc(userRef, { 
        bestScore: score,
        name: user.displayName || user.email,
      }, { merge: true });
    }

    console.log("Score saved and bestScore updated if needed");
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

export const getUserBestScore = async (user: User): Promise<number> => {
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const data = userDoc.data();
  return data?.bestScore || 0;
};
