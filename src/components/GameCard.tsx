import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  imageUrl: string;
  isActive?: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

const SWIPE_THRESHOLD = 100;

const GameCard = ({
  imageUrl,
  isActive = true,
  onSwipeUp,
  onSwipeDown,
  className = "",
}: GameCardProps) => {
  const handleDragEnd = (_: any, info: any) => {
    const offsetY = info.offset.y;

    if (offsetY < -SWIPE_THRESHOLD) {
      onSwipeUp?.();
    } else if (offsetY > SWIPE_THRESHOLD) {
      onSwipeDown?.();
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ rotate: 10, scale: 1.05 }}
      className={`relative w-full max-w-sm aspect-[3/4] overflow-hidden cursor-grab active:cursor-grabbing transition-transform ${isActive ? "z-10" : "z-0 scale-95 opacity-80"} ${className}`}
    >
      <Card className="w-full h-full">
        <img
          src={imageUrl}
          alt="Game card"
          className="w-full h-full object-cover"
        />
        <div className="card-shine" />
      </Card>
    </motion.div>
  );
};

export default GameCard;
