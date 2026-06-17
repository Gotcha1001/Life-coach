"use client";
import { useEffect, useState } from "react";

interface RevealTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function RevealText({ text, speed = 18, className, onComplete }: RevealTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-4 bg-fuchsia-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
