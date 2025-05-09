
import { Shield, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface GameHeaderProps {
  currentScore?: number;
  className?: string;
  showScore?: boolean;
}

const GameHeader = ({ currentScore = 0, className, showScore = true }: GameHeaderProps) => {
  return (
    <header className={cn("flex items-center justify-between w-full p-4", className)}>
      <Link to="/" className="flex items-center gap-2">
        <Shield className="text-game-cyan w-6 h-6" />
        <span className="font-bold text-lg text-white">Fraud<span className="text-game-cyan">Safe</span></span>
      </Link>
      
      <div className="flex items-center gap-4">
        {showScore && (
          <div className="flex items-center gap-2 bg-accent/30 px-3 py-1 rounded-full">
            <Trophy className="text-yellow-400 w-4 h-4" />
            <span className="text-white font-medium">{currentScore}</span>
          </div>
        )}
        
        <Link to="/leaderboard" className="flex items-center justify-center w-8 h-8 bg-accent/30 rounded-full hover:bg-accent/50 transition-colors">
          <Trophy className="text-yellow-400 w-4 h-4" />
        </Link>
        
        <Link to="/profile" className="flex items-center justify-center w-8 h-8 bg-accent/30 rounded-full hover:bg-accent/50 transition-colors">
          <User className="text-white w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

export default GameHeader;
