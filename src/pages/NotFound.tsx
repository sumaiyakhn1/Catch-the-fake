
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import GameButton from "@/components/GameButton";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center game-container">
      <div className="text-center">
        <Shield className="text-game-cyan w-16 h-16 mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page doesn't exist or was moved
        </p>
        <Link to="/">
          <GameButton>Return to Home</GameButton>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
