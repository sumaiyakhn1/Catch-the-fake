import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GameHeader from "@/components/GameHeader";
import TechCircle from "@/components/TechCircle";
import { auth } from "@/lib/firebase";
import { saveScore, getUserBestScore } from "@/lib/saveScore";

const mockCards = [
  { id: 1, isFraud: true, imageUrl: "/assets/img1.jpg" },
  { id: 2, isFraud: true, imageUrl: "/assets/img2.jpeg" },
  { id: 3, isFraud: true, imageUrl: "/assets/img3.jpeg" },
  { id: 4, isFraud: false, imageUrl: "/assets/img4.jpeg" },
  { id: 5, isFraud: false, imageUrl: "/assets/img5.jpg" },
  { id: 6, isFraud: false, imageUrl: "/assets/img6.jpeg" },
  { id: 7, isFraud: true, imageUrl: "/assets/img7.webp" },
  { id: 8, isFraud: false, imageUrl: "/assets/img8.jpg" },
  { id: 9, isFraud: true, imageUrl: "/assets/img9.jpg" },
  { id: 10, isFraud: false, imageUrl: "/assets/img10.jpg" },
];


const Game = () => {
  const [cards, setCards] = useState([...mockCards]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  const handleSwipe = (direction: number) => {
    if (cards.length === 0) return;

    const current = cards[0];
    const guessedFraud = direction > 0; // down = fraud, up = safe
    const correct = current.isFraud === guessedFraud;

    if (correct) {
      setScore((prev) => prev + 10);
      toast({
        title: "Correct!",
        description: `+10 points! ${guessedFraud ? "That was a fraud attempt." : "That was safe content."}`,
      });
    } else {
      toast({
        title: "Wrong!",
        description: `${guessedFraud ? "That was safe content." : "That was a fraud attempt."}`,
        variant: "destructive",
      });
    }

    const nextCards = cards.slice(1);
    setCards(nextCards);
    if (nextCards.length === 0) setGameOver(true);
  };

  const restart = () => {
    setCards([...mockCards].sort(() => Math.random() - 0.5));
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => { 
    const fetchBestScore = async () => {
      if (auth.currentUser) {
        const best = await getUserBestScore(auth.currentUser);
        setBestScore(best);
      }
    };
    fetchBestScore();
  }, []);

  useEffect(() => {
    if (gameOver && auth.currentUser) {
      saveScore(auth.currentUser, score);
    }
  }, [gameOver]);

  return (
    <div className="min-h-screen w-full flex flex-col relative game-container bg-background text-white">
      <GameHeader currentScore={score} />

      {/* Background Tech Circle */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
             <TechCircle className="w-[120vh] h-[120vh] opacity-20" />
           </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {gameOver ? (
          <div className="bg-card/60 backdrop-blur-md rounded-2xl p-8 text-center animate-slide-in max-w-sm w-full glowing-border border border-border/50">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <div className="w-20 h-20 bg-game-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-game-cyan" />
            </div>
            <p className="text-lg mb-2">Your final score</p>
            <p className="text-4xl font-bold mb-2 text-game-cyan">{score}</p>
            {bestScore !== null && (
              <p className="text-sm text-muted-foreground mb-4">
                Your best score: <span className="font-semibold">{bestScore}</span>
              </p>
            )}
            <button
              onClick={restart}
              className="w-full py-3 px-6 bg-game-cyan text-white rounded-full font-medium hover:bg-opacity-90 transition-all"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6">CATCH THE FAKE</h2>

            <div className="relative w-72 h-[400px]">
              <AnimatePresence>
                {cards.length > 0 && (
                  <motion.img
                    key={cards[0].id}          //card id as a prop
                    src={cards[0].imageUrl} //display current card
                    className="absolute w-full h-full object-cover rounded-xl shadow-lg"
                    initial={{ y: 0, opacity: 1 }}
                    drag="y" // in only vertical direction
                    dragConstraints={{ top: 0, bottom: 0 }} //visually dont let move
                    dragElastic={0.5} //for real feel
                    onDragEnd={(_, info) => {
                      if (info.offset.y < -100) handleSwipe(-1); // up = safe
                      else if (info.offset.y > 100) handleSwipe(1); // down = fraud
                    }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Swipe <span className="text-green-400">up</span> for Safe, <span className="text-red-400">down</span> for Fraud
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
