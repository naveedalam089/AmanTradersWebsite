import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

// Animation variants for different entry effects
export const animationVariants = {
  fadeUp: "translate-y-8 opacity-0",
  fadeDown: "translate-y-[-2rem] opacity-0",
  fadeLeft: "translate-x-8 opacity-0",
  fadeRight: "translate-x-[-2rem] opacity-0",
  scaleUp: "scale-95 opacity-0",
  blur: "blur-sm opacity-0",
  visible: "translate-y-0 translate-x-0 scale-100 blur-0 opacity-100",
};
