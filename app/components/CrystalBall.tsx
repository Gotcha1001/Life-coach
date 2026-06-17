"use client";
import { motion } from "framer-motion";

interface CrystalBallProps {
  glowing?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
};

// Deterministic star positions — no Math.random() during render (causes hydration
// mismatches) and no useEffect+setState (causes cascading renders). These are
// decorative sparkles; exact coords don't matter, only that they look scattered.
const STAR_POSITIONS = [
  { top: 25, left: 30 },
  { top: 55, left: 65 },
  { top: 70, left: 40 },
  { top: 35, left: 70 },
  { top: 60, left: 25 },
  { top: 22, left: 55 },
  { top: 75, left: 60 },
  { top: 45, left: 48 },
];

export function CrystalBall({ glowing = false, size = "md" }: CrystalBallProps) {
  return (
    <motion.div
      animate={glowing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`${sizes[size]} relative`}
    >
      {/* Outer glow */}
      {glowing && (
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(139,63,240,0.6) 0%, rgba(232,121,249,0.3) 50%, transparent 70%)",
            filter: "blur(15px)",
            transform: "scale(1.3)",
          }}
        />
      )}

      {/* Ball */}
      <div className={`${sizes[size]} rounded-full crystal-ball relative overflow-hidden`}>
        {/* Inner light */}
        <div
          className="absolute w-1/3 h-1/3 rounded-full top-[20%] left-[25%]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(200,150,255,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Mist swirls */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 30%, rgba(200,150,255,0.5) 50%, transparent 70%)",
          }}
        />

        {/* Inner orb particles */}
        {glowing && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-fuchsia-300"
                animate={{
                  x: [0, Math.sin((i * 72 * Math.PI) / 180) * 30],
                  y: [0, Math.cos((i * 72 * Math.PI) / 180) * 30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ top: "50%", left: "50%" }}
              />
            ))}
          </>
        )}

        {/* Stars inside — deterministic positions, safe for SSR */}
        {STAR_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-white"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
          />
        ))}
      </div>

      {/* Stand reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-3 rounded-full"
        style={{ background: "rgba(139,63,240,0.3)", filter: "blur(4px)" }}
      />
    </motion.div>
  );
}