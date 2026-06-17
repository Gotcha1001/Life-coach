// "use client";

// import { useCallback, useRef } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type SoundName =
//   | "cardPlay"
//   | "cardPlayRed"
//   | "cardPlayBlue"
//   | "cardPlayGreen"
//   | "cardPlayYellow"
//   | "cardPlayWild"
//   | "cardDraw"
//   | "cardDeal"
//   | "yourTurn"
//   | "unoAlert"
//   | "win"
//   | "lose"
//   | "buttonClick"
//   | "roomJoin"
//   | "gameStart";

// // ─── Audio file helper ────────────────────────────────────────────────────────

// function playFile(src: string, volume = 1) {
//   const audio = new Audio(src);
//   audio.volume = volume;
//   audio.play().catch(() => {}); // silently ignore autoplay blocks
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// export function useSoundManager() {
//   const mutedRef = useRef(false);

//   const play = useCallback((sound: SoundName, color?: string) => {
//     if (mutedRef.current) return;
//     try {
//       switch (sound) {
//         case "cardPlay":
//           // generic — uses color param if passed, falls back to red
//           playFile(`/sounds/card-play-${color ?? "red"}.mp3`);
//           break;
//         case "cardPlayRed":
//           playFile("/sounds/card-play-red.mp3");
//           break;
//         case "cardPlayBlue":
//           playFile("/sounds/card-play-blue.mp3");
//           break;
//         case "cardPlayGreen":
//           playFile("/sounds/card-play-green.mp3");
//           break;
//         case "cardPlayYellow":
//           playFile("/sounds/card-play-yellow.mp3");
//           break;
//         case "cardPlayWild":
//           playFile("/sounds/card-play-wild.mp3");
//           break;
//         case "cardDraw":
//           playFile("/sounds/card-draw.mp3");
//           break;
//         case "cardDeal":
//           playFile("/sounds/card-deal.mp3", 0.7);
//           break;
//         case "yourTurn":
//           playFile("/sounds/your-turn.mp3");
//           break;
//         case "unoAlert":
//           playFile("/sounds/uno-alert.mp3");
//           break;
//         case "win":
//           playFile("/sounds/win.mp3");
//           break;
//         case "lose":
//           playFile("/sounds/lose.mp3");
//           break;
//         case "buttonClick":
//           playFile("/sounds/button-click.mp3", 0.5);
//           break;
//         case "roomJoin":
//           playFile("/sounds/room-join.mp3");
//           break;
//         case "gameStart":
//           playFile("/sounds/game-start.mp3");
//           break;
//       }
//     } catch (e) {
//       console.warn("Sound error:", e);
//     }
//   }, []);

//   const setMuted = useCallback((muted: boolean) => {
//     mutedRef.current = muted;
//   }, []);

//   const isMuted = useCallback(() => mutedRef.current, []);

//   return { play, setMuted, isMuted };
// }

"use client";

import { useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SoundName =
  // ── existing UNO / card sounds ────────────────────────────────────────────
  | "cardPlay"
  | "cardPlayRed"
  | "cardPlayBlue"
  | "cardPlayGreen"
  | "cardPlayYellow"
  | "cardPlayWild"
  | "cardDraw"
  | "cardDeal"
  | "yourTurn"
  | "unoAlert"
  | "win"
  | "lose"
  | "buttonClick"
  | "roomJoin"
  | "gameStart"
  // ── chess sounds ──────────────────────────────────────────────────────────
  | "chessMove" // normal piece move
  | "chessCapture" // piece captured
  | "chessCastle" // castling
  | "chessCheck" // opponent put in check
  | "chessPromotion" // pawn promoted
  | "chessGameEnd"; // checkmate / stalemate / draw

// ─── Audio-file helper ────────────────────────────────────────────────────────

function playFile(src: string, volume = 1) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {}); // silently ignore autoplay policy
}

// ─── Web-Audio synthesiser (fallback only) ────────────────────────────────────

type OscType = "sine" | "triangle" | "square" | "sawtooth";

function tone(
  freq: number,
  duration: number,
  volume = 0.18,
  type: OscType = "sine",
  delayMs = 0,
) {
  setTimeout(() => {
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration,
      );
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      osc.onended = () => ctx.close();
    } catch {
      /* Web Audio not available — skip silently */
    }
  }, delayMs);
}

function synthesiseChessSound(name: SoundName) {
  switch (name) {
    case "chessMove":
      tone(520, 0.07, 0.15, "triangle");
      tone(370, 0.09, 0.1, "triangle", 55);
      break;
    case "chessCapture":
      tone(300, 0.06, 0.22, "sawtooth");
      tone(190, 0.12, 0.18, "square", 50);
      break;
    case "chessCastle":
      tone(600, 0.08, 0.14, "sine");
      tone(750, 0.08, 0.14, "sine", 120);
      break;
    case "chessCheck":
      tone(440, 0.05, 0.2, "square");
      tone(660, 0.05, 0.2, "square", 80);
      tone(880, 0.07, 0.2, "square", 160);
      break;
    case "chessPromotion":
      [523, 659, 784, 1047].forEach((f, i) =>
        tone(f, 0.15, 0.18, "sine", i * 80),
      );
      break;
    case "chessGameEnd":
      [784, 659, 523, 392].forEach((f, i) =>
        tone(f, 0.35, 0.15, "sine", i * 160),
      );
      break;
    default:
      break;
  }
}

// ─── Chess sound dispatcher ───────────────────────────────────────────────────
// Maps chess events to the mp3s that actually exist in /public/sounds/.
// If the file fails to load, falls back to the synthesised tone.

const CHESS_SOUND_FILES: Partial<Record<SoundName, string>> = {
  chessMove: "/sounds/your-turns.mp3", // soft placement thud
  chessCapture: "/sounds/card-play-wild.mp3", // punchy hit
  chessCastle: "/sounds/card-draw.mp3", // double-action feel
  chessCheck: "/sounds/check.mp3", // urgent alert
  chessPromotion: "/sounds/win.mp3", // triumphant
  chessGameEnd: "/sounds/lose.mp3", // game over
};

function playChessSound(name: SoundName) {
  const src = CHESS_SOUND_FILES[name];
  if (!src) {
    synthesiseChessSound(name);
    return;
  }
  const audio = new Audio(src);
  audio.volume = 0.8;
  audio.play().catch(() => synthesiseChessSound(name)); // fallback if file missing
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSoundManager() {
  const mutedRef = useRef(false);

  const play = useCallback((sound: SoundName, color?: string) => {
    if (mutedRef.current) return;

    // ── Chess sounds ──────────────────────────────────────────────────────────
    if (sound.startsWith("chess")) {
      playChessSound(sound);
      return;
    }

    // ── UNO / card sounds (unchanged) ─────────────────────────────────────────
    try {
      switch (sound) {
        case "cardPlay":
          playFile(`/sounds/card-play-${color ?? "red"}.mp3`);
          break;
        case "cardPlayRed":
          playFile("/sounds/card-play-red.mp3");
          break;
        case "cardPlayBlue":
          playFile("/sounds/card-play-blue.mp3");
          break;
        case "cardPlayGreen":
          playFile("/sounds/card-play-green.mp3");
          break;
        case "cardPlayYellow":
          playFile("/sounds/card-play-yellow.mp3");
          break;
        case "cardPlayWild":
          playFile("/sounds/card-play-wild.mp3");
          break;
        case "cardDraw":
          playFile("/sounds/card-draw.mp3");
          break;
        case "cardDeal":
          playFile("/sounds/card-deal.mp3", 0.7);
          break;
        case "yourTurn":
          playFile("/sounds/your-turn.mp3");
          break;
        case "unoAlert":
          playFile("/sounds/uno-alert.mp3");
          break;
        case "win":
          playFile("/sounds/win.mp3");
          break;
        case "lose":
          playFile("/sounds/lose.mp3");
          break;
        case "buttonClick":
          playFile("/sounds/button-click.mp3", 0.5);
          break;
        case "roomJoin":
          playFile("/sounds/room-join.mp3");
          break;
        case "gameStart":
          playFile("/sounds/room-join.mp3"); // reuses room-join as game start
          break;
      }
    } catch (e) {
      console.warn("Sound error:", e);
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  return { play, setMuted, isMuted };
}
