"use client";
import { useEffect, useState } from "react";

export default function useAutoLimit() {
  const [limit, setLimit] = useState(10); // default fallback

  const calculateLimit = () => {
    const screenHeight = window.innerHeight;

    // Estimate card height ~150px (including padding)
    const estimatedCardHeight = 10;

    // Max cards that fit without scrolling
    const cardsPerPage = Math.floor((screenHeight - 200) / estimatedCardHeight);

    setLimit(Math.min(Math.max(cardsPerPage, 2), 9));
  };

  useEffect(() => {
    calculateLimit();
    window.addEventListener("resize", calculateLimit);
    return () => window.removeEventListener("resize", calculateLimit);
  }, []);

  return limit;
}
