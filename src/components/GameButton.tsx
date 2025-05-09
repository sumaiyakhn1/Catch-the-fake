
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fraud" | "safe" | "primary" | "secondary";
  size?: "default" | "sm" | "lg" | "xl";
  children: React.ReactNode;
}

const GameButton = ({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}: GameButtonProps) => {
  // Get the appropriate classes based on the variant
  const getVariantClasses = () => {
    switch (variant) {
      case "fraud":
        return "fraud-gradient text-white hover:brightness-110";
      case "safe":
        return "safe-gradient text-white hover:brightness-110";
      case "primary":
        return "bg-game-cyan text-white hover:bg-opacity-90";
      case "secondary":
        return "bg-accent text-white hover:bg-opacity-90";
      default:
        return "bg-game-cyan text-white hover:bg-opacity-90";
    }
  };

  // Get the appropriate classes based on the size
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-3 text-sm";
      case "lg":
        return "py-3 px-6 text-lg";
      case "xl":
        return "py-4 px-8 text-xl";
      default:
        return "py-2 px-4";
    }
  };

  return (
    <Button
      className={cn(
        "font-medium rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GameButton;
