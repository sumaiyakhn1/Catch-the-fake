
import { cn } from "@/lib/utils";

interface TechCircleProps {
  className?: string;
  children?: React.ReactNode;
}

const TechCircle = ({ className, children }: TechCircleProps) => {
  return (
    <div 
      className={cn(
        "tech-circle relative rounded-full animate-pulse-glow", 
        className
      )}
    >
      {children}
    </div>
  );
};

export default TechCircle;
