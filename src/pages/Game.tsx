import { useState, useEffect } from "react";
import GameHeader from "@/components/GameHeader";
import GameCard from "@/components/GameCard";
import TechCircle from "@/components/TechCircle";
import { Shield, ShieldCheck, ShieldX, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Mock data with realistic fraud messages
const mockCards = [
  { 
    id: 1, 
    imageUrl: "https://picsum.photos/400/600?random=1", 
    isFraud: true,
    content: "Hello mate, your FEDEX package with code CP-84123-CH183 is waiting for you to set delivery preferences: fedex.info/DEO8G7G2UaM"
  },
  { 
    id: 2, 
    imageUrl: "https://picsum.photos/400/600?random=2", 
    isFraud: false,
    content: "Hi John, just a reminder about our meeting tomorrow at 2 PM. Looking forward to seeing you there!"
  },
  { 
    id: 3, 
    imageUrl: "https://picsum.photos/400/600?random=3", 
    isFraud: true,
    content: "ALERT: Your bank account has been suspended due to suspicious activity. Login here to verify: secure-bank-verify2.com"
  },
  { 
    id: 4, 
    imageUrl: "https://picsum.photos/400/600?random=4", 
    isFraud: false,
    content: "Your Amazon order #302-9584726 has shipped and will arrive on May 12. Track your package: amazon.com/track"
  },
  { 
    id: 5, 
    imageUrl: "https://picsum.photos/400/600?random=5", 
    isFraud: true,
    content: "Congratulations! You've won $5,000 in our weekly lottery! Click to claim your prize now: claim-prizes.org/collect"
  },
];

const Game = () => {
  const [cards, setCards] = useState(mockCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);
  const { toast } = useToast();
  
  const handleCardAction = (action: "safe" | "fraud") => {
    const currentCard = cards[currentCardIndex];
    const isFraudChoice = action === "fraud";
    
    // Set swipe direction for visual feedback
    setSwipeDirection(isFraudChoice ? "down" : "up");
    
    // Check if the user made the correct choice
    const isCorrect = currentCard.isFraud === isFraudChoice;
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct!",
        description: `+10 points! ${isFraudChoice ? "That was a fraud attempt." : "That was safe content."}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Wrong!",
        description: `${isFraudChoice ? "That was safe content." : "That was a fraud attempt."}`,
        variant: "destructive",
      });
    }
    
    // Reset swipe direction after a delay
    setTimeout(() => setSwipeDirection(null), 800);
    
    // Move to next card or end game
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };
  
  // Handlers for safe/fraud actions
  const handleFraudAction = () => handleCardAction("fraud");
  const handleSafeAction = () => handleCardAction("safe");
  
  // Restart game
  const restartGame = () => {
    // Shuffle cards for a new game
    const shuffledCards = [...mockCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setScore(0);
    setGameOver(false);
    setSwipeDirection(null);
  };

  useEffect(() => {
    restartGame();
  }, []);

  // Key handlers for desktop play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      if (e.key === "ArrowDown") {
        handleFraudAction();
      } else if (e.key === "ArrowUp") {
        handleSafeAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCardIndex, gameOver]);

  return (
    <div className="min-h-screen w-full flex flex-col game-container">
      <GameHeader currentScore={score} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <TechCircle className="w-[80vh] h-[80vh] opacity-20" />
        </div>
        
        <div className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center">
          {gameOver ? (
            <div className="bg-card/60 backdrop-blur-md rounded-2xl p-8 text-center animate-slide-in max-w-sm w-full glowing-border border border-border/50">
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <div className="w-20 h-20 bg-game-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-10 h-10 text-game-cyan" />
              </div>
              <p className="text-lg mb-2">Your final score</p>
              <p className="text-4xl font-bold mb-6 text-game-cyan">{score}</p>
              <button onClick={restartGame} className="w-full py-3 px-6 bg-game-cyan text-white rounded-full font-medium hover:bg-opacity-90 transition-all">
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold mb-4">CATCH THE FAKE</h2>
                
                <div className={cn(
                  "max-w-xs mx-auto bg-card/60 backdrop-blur-md px-5 py-3 rounded-full border transition-all duration-300",
                  swipeDirection === "up" ? "border-game-safe shadow-[0_0_15px_rgba(0,242,96,0.7)]" : "border-border/50"
                )}>
                  <div className="flex items-center justify-center">
                    <ArrowUp className="text-game-safe w-5 h-5 mr-2" />
                    <span className="text-sm">Swipe <span className="text-game-safe">UP</span> for Safe</span>
                  </div>
                </div>
                
                <div className={cn(
                  "max-w-xs mx-auto bg-card/60 backdrop-blur-md px-5 py-3 rounded-full border mt-2 transition-all duration-300",
                  swipeDirection === "down" ? "border-game-fraud shadow-[0_0_15px_rgba(255,18,79,0.7)]" : "border-border/50"
                )}>
                  <div className="flex items-center justify-center">
                    <ArrowDown className="text-game-fraud w-5 h-5 mr-2" />
                    <span className="text-sm">Swipe <span className="text-game-fraud">DOWN</span> for Fraud</span>
                  </div>
                </div>
              </div>
              
              <div className="relative w-full aspect-[3/5] max-w-sm mb-8">
                {cards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className={`absolute inset-0 transition-all duration-300 ${
                      index < currentCardIndex ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ zIndex: cards.length - index }}
                  >
                    {index === currentCardIndex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full max-w-xs p-4 bg-white rounded-md shadow-lg">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="text-xs text-gray-500">+1 (323) 556-7327</div>
                          </div>
                          <div className="py-2 text-xs text-gray-400">
                            Text Message
                            <div className="text-xs text-gray-400">Today, 10:42 AM</div>
                          </div>
                          <div className="text-sm text-gray-800">
                            {card.content}
                          </div>
                        </div>
                      </div>
                    )}
                    <GameCard 
                      imageUrl="transparent"
                      isActive={index === currentCardIndex}
                      onSwipeUp={handleSafeAction}
                      onSwipeDown={handleFraudAction}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center mb-4">
                {currentCardIndex < cards.length && swipeDirection === null && (
                  <p className="text-sm text-muted-foreground">
                    Swipe up for safe message, down for fraud
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
