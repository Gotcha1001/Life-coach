// "use client";
// import { useEffect, useState } from "react";

// interface RevealTextProps {
//   text: string;
//   speed?: number;
//   className?: string;
//   onComplete?: () => void;
// }

// export function RevealText({ text, speed = 18, className, onComplete }: RevealTextProps) {
//   const [displayed, setDisplayed] = useState("");
//   const [done, setDone] = useState(false);

//   useEffect(() => {
//     setDisplayed("");
//     setDone(false);
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i < text.length) {
//         setDisplayed(text.slice(0, i + 1));
//         i++;
//       } else {
//         clearInterval(interval);
//         setDone(true);
//         onComplete?.();
//       }
//     }, speed);
//     return () => clearInterval(interval);
//   }, [text, speed, onComplete]);

//   return (
//     <span className={className}>
//       {displayed}
//       {!done && (
//         <span className="inline-block w-0.5 h-4 bg-fuchsia-400 ml-0.5 animate-pulse" />
//       )}
//     </span>
//   );
// }

"use client";
import { useEffect, useState } from "react";

interface RevealTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function RevealText({
  text,
  speed = 18,
  className,
  onComplete,
}: RevealTextProps) {
  // Track the text we last reset for. When `text` changes, reset the
  // typing state during render instead of inside an effect — this is
  // React's recommended pattern for "adjusting state when a prop changes"
  // and avoids the cascading-render warning.
  const [prevText, setPrevText] = useState(text);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayed("");
    setDone(false);
  }

  useEffect(() => {
    // The effect now only owns the timer (the external system) — it
    // doesn't reset state itself, so it can't cause a render-on-mount
    // cascade.
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
        <span className="inline-block w-0.5 h-4 bg-fuchsia-600 dark:bg-fuchsia-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
