import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  imageUrl: string;
  isActive?: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  status?: "safe" | "fraud";
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
      : status === "fraud"
      ? "ring-4 ring-red-500 shadow-[0_0_30px_#ef444480]"
      : "";

  return (
    <motion.div
      key={imageUrl} // ensures re-render/exit animations work
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragSnapToOrigin
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        rotate: 5,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
      }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: status === "safe" ? -200 : status === "fraud" ? 200 : 150,
        transition: { duration: 0.3 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
