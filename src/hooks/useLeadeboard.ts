// src/hooks/useLeaderboard.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

type LeaderboardEntry = {
  name: string;
  score: number;
};

export function useLeaderboard(limitCount = 10) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "scores"),
      orderBy("score", "desc"),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedLeaders: LeaderboardEntry[] = snapshot.docs.map(doc => ({
        name: doc.data().name || "Anonymous",
        score: doc.data().score || 0
      }));
      setLeaders(updatedLeaders);
    });

    return () => unsubscribe();
  }, [limitCount]);

  return leaders;
}
