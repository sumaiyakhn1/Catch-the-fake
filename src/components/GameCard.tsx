
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface GameCardProps {
  imageUrl: string;
  isActive?: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

const GameCard = ({ imageUrl, isActive = true, onSwipeUp, onSwipeDown, className }: GameCardProps) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [swipeAnimation, setSwipeAnimation] = useState<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    setStartY(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setStartY(e.clientY);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || !isActive) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    setOffsetY(diff);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (startY === null || !isActive) return;
    const currentY = e.clientY;
    const diff = currentY - startY;
    setOffsetY(diff);
  };

  const handleTouchEnd = () => {
    if (startY === null || !isActive) return;
    if (offsetY < -100) {
      // Swiped up - Safe
      setSwipeAnimation("animate-card-swipe-up");
      setTimeout(() => {
        if (onSwipeUp) onSwipeUp();
        resetSwipe();
      }, 500);
    } else if (offsetY > 100) {
      // Swiped down - Fraud
      setSwipeAnimation("animate-card-swipe-down");
      setTimeout(() => {
        if (onSwipeDown) onSwipeDown();
        resetSwipe();
      }, 500);
    } else {
      // Not enough swipe distance, reset
      resetSwipe();
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    handleTouchEnd();
  };

  const resetSwipe = () => {
    setStartY(null);
    setOffsetY(0);
    setSwipeAnimation(null);
  };

  const getRotation = () => {
    if (!isActive) return "rotate-0";
    // Limit the rotation to a reasonable range
    return `rotate-${Math.min(Math.max(Math.floor(-offsetY / 20), -15), 15)}`;
  };

  // Determine glow based on swipe direction
  const getBorderGlow = () => {
    if (offsetY < -30) {
      // Swiping up - Safe (green glow)
      return "border-2 border-game-safe shadow-[0_0_15px_rgba(0,242,96,0.7)]";
    } else if (offsetY > 30) {
      // Swiping down - Fraud (red glow)
      return "border-2 border-game-fraud shadow-[0_0_15px_rgba(255,18,79,0.7)]";
    }
    return "";
  };

  return (
    <Card
      className={cn(
        "relative w-full max-w-sm aspect-[3/4] overflow-hidden card-shadow transition-transform cursor-grab active:cursor-grabbing",
        isActive ? "z-10" : "z-0 scale-95 opacity-80",
        swipeAnimation,
        getBorderGlow(),
        className
      )}
      style={{ 
        transform: `translateY(${offsetY}px) ${getRotation()}`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full">
        <img
          src={imageUrl}
          alt="Game card content"
          className="w-full h-full object-cover"
        />
        <div className="card-shine"></div>
      </div>
    </Card>
  );
};

export default GameCard;
