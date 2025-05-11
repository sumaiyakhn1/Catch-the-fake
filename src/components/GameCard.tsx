import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  imageUrl: string;
  isActive?: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  status?: "safe" | "faulty";
}

const SWIPE_THRESHOLD = 100;

const GameCard = ({
  imageUrl,
  isActive = true,
  onSwipeUp,
  onSwipeDown,
  className = "",
  status,
}: GameCardProps) => {
  const handleDragEnd = (_: any, info: any) => {
    const offsetY = info.offset.y;

    if (offsetY < -SWIPE_THRESHOLD) {
      onSwipeUp?.();
    } else if (offsetY > SWIPE_THRESHOLD) {
      onSwipeDown?.();
    }
  };

  const statusGlow =
    status === "safe"
      ? "ring-4 ring-green-500 shadow-[0_0_30px_#22c55e80]"
      : status === "faulty"
      ? "ring-4 ring-red-500 shadow-[0_0_30px_#ef444480]"
      : "";

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ rotate: 10, scale: 1.05 }}
      className={`relative w-full max-w-sm aspect-[3/4] cursor-grab active:cursor-grabbing transition-transform 
        ${isActive ? "z-10" : "z-0 scale-95 opacity-80"} 
        ${statusGlow} ${className}`}
      style={{ borderRadius: "0.5rem" }} // Matches Tailwind's rounded-md
    >
      <Card className="w-full h-full overflow-hidden rounded-md">
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
