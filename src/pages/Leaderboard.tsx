import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GameHeader from "@/components/GameHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechCircle from "@/components/TechCircle";
import { Trophy, ArrowLeft, User } from "lucide-react";

type ScoreEntry = {
  id: string;
  uid: string;
  name: string;
  score: number;
  createdAt: { seconds: number };
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<ScoreEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<"all" | "monthly" | "weekly">("all");

  useEffect(() => {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allScores: ScoreEntry[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.uid || !data.score || !data.createdAt) return;
        allScores.push({
          id: doc.id,
          uid: data.uid,
          name: data.name || "Anonymous",
          score: data.score,
          createdAt: data.createdAt,
        });
      });

      const now = Date.now() / 1000;

      const timeFiltered = allScores.filter((entry) => {
        if (timeFrame === "weekly") {
          return now - entry.createdAt.seconds <= 7 * 24 * 60 * 60;
        } else if (timeFrame === "monthly") {
          return now - entry.createdAt.seconds <= 30 * 24 * 60 * 60;
        }
        return true;
      });

      // Keep only the best score per user
      const bestScoresMap = new Map<string, ScoreEntry>();
      timeFiltered.forEach((entry) => {
        const existing = bestScoresMap.get(entry.uid);
        if (!existing || entry.score > existing.score) {
          bestScoresMap.set(entry.uid, entry);
        }
      });

      const bestScores = Array.from(bestScoresMap.values()).sort((a, b) => b.score - a.score);
      setLeaderboardData(bestScores);
    });

    return () => unsubscribe();
  }, [timeFrame]);

  return (
    <div className="min-h-screen w-full flex flex-col game-container">
      <GameHeader showScore={false} />

      <div className="flex-1 flex flex-col items-center p-4 relative">
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <TechCircle className="w-[80vh] h-[80vh] opacity-20" />
        </div>

        <div className="w-full max-w-3xl z-10 flex flex-col items-center mt-4">
          <Link to="/game" className="self-start mb-4 flex items-center text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Game
          </Link>

          <Card className="w-full bg-card/60 backdrop-blur-md border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center">
                <Trophy className="text-yellow-400 w-5 h-5 mr-2" />
                Leaderboard
              </CardTitle>

              <div className="flex bg-accent/30 rounded-lg">
                <button
                  onClick={() => setTimeFrame("all")}
                  className={`px-3 py-1 text-sm rounded-lg ${timeFrame === "all" ? "bg-accent text-white" : "text-muted-foreground"}`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimeFrame("monthly")}
                  className={`px-3 py-1 text-sm rounded-lg ${timeFrame === "monthly" ? "bg-accent text-white" : "text-muted-foreground"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeFrame("weekly")}
                  className={`px-3 py-1 text-sm rounded-lg ${timeFrame === "weekly" ? "bg-accent text-white" : "text-muted-foreground"}`}
                >
                  Weekly
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((player, index) => {
                  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${player.name}`;
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center p-3 rounded-lg ${
                        index === 0
                          ? "bg-yellow-400/20 border border-yellow-400/30"
                          : index === 1
                          ? "bg-slate-300/10 border border-slate-300/20"
                          : index === 2
                          ? "bg-amber-700/10 border border-amber-700/20"
                          : "bg-background/40"
                      } animate-slide-in`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 text-white font-bold mr-3">
                        {index + 1}
                      </div>

                      <div className="w-10 h-10 rounded-full overflow-hidden bg-accent/30 mr-3 flex-shrink-0">
                        <img src={avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium">{player.name}</h3>
                      </div>

                      <div className="flex items-center">
                        <Trophy
                          className={`w-4 h-4 mr-1 ${
                            index === 0
                              ? "text-yellow-400"
                              : index === 1
                              ? "text-slate-300"
                              : index === 2
                              ? "text-amber-700"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="font-bold">{player.score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
