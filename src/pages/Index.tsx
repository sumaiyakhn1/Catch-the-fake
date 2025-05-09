
import { Link } from "react-router-dom";
import TechCircle from "@/components/TechCircle";
import GameButton from "@/components/GameButton";
import { Shield, LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center game-container relative overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <TechCircle className="w-[120vh] h-[120vh] opacity-20" />
      </div>
      
      <div className="relative z-10 max-w-xl w-full px-6 py-12 text-center animate-float">
        <div className="flex items-center justify-center mb-6">
          <Shield className="text-game-cyan w-12 h-12 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Fraud<span className="text-game-cyan">Safe</span>
          </h1>
        </div>
        
        <h2 className="text-xl md:text-2xl font-medium mb-8">
          CATCH THE FAKE
        </h2>
        
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">
          Beware of Fraud Messages! Test your skills at identifying fraud content,
          collect points, and compete with others on the leaderboard.
        </p>
        
        <div className="flex justify-center">
          <Link to="/auth">
            <GameButton size="lg">
              <span className="flex items-center gap-2">
                Login to Play <LogIn className="w-5 h-5" />
              </span>
            </GameButton>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full flex justify-center p-4 z-10">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 FraudSafe Game. All rights reserved.<br />
          Spot the fraud and collect points.
        </p>
      </div>
      
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-game-fraud/5 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-game-safe/5 blur-3xl"></div>
    </div>
  );
};

export default Index;
