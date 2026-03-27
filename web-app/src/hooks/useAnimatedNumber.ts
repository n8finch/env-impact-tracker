import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly animates a number from its previous value to a new target.
 * Uses ease-out cubic easing. The current displayed value is tracked
 * via a ref so interrupted animations start from where they left off.
 */
export function useAnimatedNumber(target: number, duration = 450): number {
  const [displayValue, setDisplayValue] = useState(target);
  const currentRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = currentRef.current;
    let startTime = 0;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      currentRef.current = current;
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return displayValue;
}
