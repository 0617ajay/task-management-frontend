'use client';
import { useEffect, useState } from "react";

export function useResponsiveSkeleton() {
  const [count, setCount] = useState(6);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      if (w < 576) setCount(2);        // MOBILE
      else if (w < 768) setCount(4);   // SMALL TABLET
      else if (w < 1200) setCount(6);  // NORMAL DESKTOP
      else setCount(9);                // LARGE SCREEN
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}
