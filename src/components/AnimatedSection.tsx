import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

type AnimationType = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleUp" | "blur";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

const animationClasses: Record<AnimationType, string> = {
  fadeUp: "-translate-y-0 translate-y-12",
  fadeDown: "translate-y-[-3rem]",
  fadeLeft: "-translate-x-0 translate-x-12",
  fadeRight: "translate-x-[-3rem]",
  scaleUp: "scale-90",
  blur: "blur-sm",
};

const AnimatedSection = ({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 800,
  className,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out will-change-transform",
        !isVisible && animationClasses[animation],
        !isVisible && "opacity-0",
        isVisible && "opacity-100 translate-y-0 translate-x-0 scale-100 blur-0",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
