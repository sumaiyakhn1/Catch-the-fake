
import { useState } from "react";
import { Link } from "react-router-dom";
import GameHeader from "@/components/GameHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechCircle from "@/components/TechCircle";
import { Trophy, ArrowLeft, User } from "lucide-react";

// Mock data - in a real app this would come from Firestore
const mockLeaderboardData = [
  { id: 1, username: "fraud_hunter", score: 340, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=fraud_hunter" },
  { id: 2, username: "cyber_detective", score: 310, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=cyber_detective" },
  { id: 3, username: "safety_first", score: 280, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=safety_first" },
  { id: 4, username: "secure_user", score: 250, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=secure_user" },
  { id: 5, username: "alert_citizen", score: 220, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=alert_citizen" },
  { id: 6, username: "keen_eye", score: 200, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=keen_eye" },
  { id: 7, username: "truth_seeker", score: 180, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=truth_seeker" },
  { id: 8, username: "scam_buster", score: 150, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=scam_buster" },
  { id: 9, username: "digital_guard", score: 120, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=digital_guard" },
  { id: 10, username: "shield_master", score: 100, avatar: "https://api.dicebear.com/7.x/personas/svg?seed=shield_master" },
];

const Leaderboard = () => {
  const [leaderboardData] = useState(mockLeaderboardData);
  const [timeFrame, setTimeFrame] = useState<"all" | "weekly" | "monthly">("all");

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
                {leaderboardData.map((player, index) => (
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
