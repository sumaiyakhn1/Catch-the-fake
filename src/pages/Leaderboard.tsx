import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameHeader from "@/components/GameHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechCircle from "@/components/TechCircle";
import { Trophy, ArrowLeft, User } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  avatar?: string;
  createdAt: Timestamp;
};

const Leaderboard = () => {
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
  const [filteredScores, setFilteredScores] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<"all" | "weekly" | "monthly">("all");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "scores"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          username: d.name || "Anonymous",
          score: d.score,
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${(d.name || "anon").replace(/\s+/g, "")}`,
          createdAt: d.createdAt,
        } as LeaderboardEntry;
      });
      setAllScores(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = [...allScores];

    if (timeFrame === "weekly") {
      const weeklyCutoff = new Date(now);
      weeklyCutoff.setDate(now.getDate() - 7);
      filtered = filtered.filter((entry) =>
        entry.createdAt?.toDate() >= weeklyCutoff
      );
    } else if (timeFrame === "monthly") {
      const monthlyCutoff = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((entry) =>
        entry.createdAt?.toDate() >= monthlyCutoff
      );
    }

    filtered.sort((a, b) => b.score - a.score);
    setFilteredScores(filtered.slice(0, 10)); // Top 10
  }, [allScores, timeFrame]);

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
                {["all", "monthly", "weekly"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeFrame(range as any)}
                    className={`px-3 py-1 text-sm rounded-lg ${timeFrame === range ? "bg-accent text-white" : "text-muted-foreground"}`}
                  >
                    {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredScores.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center p-3 rounded-lg ${
                      index === 0 ? "bg-yellow-400/20 border border-yellow-400/30" :
                      index === 1 ? "bg-slate-300/10 border border-slate-300/20" :
                      index === 2 ? "bg-amber-700/10 border border-amber-700/20" :
                      "bg-background/40"
                    } animate-slide-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/50 text-white font-bold mr-3">
                      {index + 1}
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden bg-accent/30 mr-3 flex-shrink-0">
                      {player.avatar ? (
                        <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{player.username}</h3>
                    </div>

                    <div className="flex items-center">
                      <Trophy className={`w-4 h-4 mr-1 ${
                        index === 0 ? "text-yellow-400" :
                        index === 1 ? "text-slate-300" :
                        index === 2 ? "text-amber-700" : "text-muted-foreground"
                      }`} />
                      <span className="font-bold">{player.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
