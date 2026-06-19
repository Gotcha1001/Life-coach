// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs";
// import { Sparkles, ScrollText } from "lucide-react";
// import { CrystalBall } from "../components/CrystalBall";

// export default function DashboardPage() {
//   const { user } = useUser();

//   return (
//     <div className="min-h-screen p-8 flex flex-col items-center justify-center">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-12 space-y-3"
//       >
//         <div className="flex justify-center mb-6 animate-float">
//           <CrystalBall size="sm" glowing />
//         </div>
//         <p className="text-fuchsia-400 font-serif text-xs tracking-[0.5em] uppercase">
//           ✦ Welcome back ✦
//         </p>
//         <h1 className="font-serif text-4xl md:text-5xl text-white glow-text">
//           {user?.firstName ? `${user.firstName}'s Sanctuary` : "Your Sanctuary"}
//         </h1>
//         <p className="text-purple-300/70 font-body text-base max-w-md mx-auto">
//           The universe has been waiting. Are you ready to hear your soul speak?
//         </p>
//         <div className="mystical-divider max-w-xs mx-auto" />
//       </motion.div>

//       {/* Single hero card */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.6 }}
//         whileHover={{ y: -6 }}
//         className="w-full max-w-md"
//       >
//         <Link href="/dashboard/soul">
//           <div
//             className="mystical-card rounded-2xl p-10 cursor-pointer border border-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all duration-500"
//             style={{
//               background:
//                 "linear-gradient(135deg, rgba(112,26,117,0.8), rgba(88,28,135,0.8))",
//             }}
//           >
//             <div className="flex flex-col items-center text-center space-y-6">
//               <motion.div
//                 whileHover={{ rotate: [0, -10, 10, 0] }}
//                 transition={{ duration: 0.5 }}
//                 className="w-20 h-20 rounded-full flex items-center justify-center"
//                 style={{
//                   background:
//                     "radial-gradient(circle, rgba(232,121,249,0.4) 0%, transparent 70%)",
//                   boxShadow: "0 0 40px rgba(232,121,249,0.4)",
//                 }}
//               >
//                 <Sparkles className="w-10 h-10 text-fuchsia-300" />
//               </motion.div>

//               <div>
//                 <h2 className="font-serif text-3xl text-white mb-2">
//                   Soul Contract
//                 </h2>
//                 <p className="text-xs text-fuchsia-300 font-serif tracking-widest uppercase">
//                   Purpose · Mission · Destiny · Truth
//                 </p>
//               </div>

//               <p className="text-purple-200/70 font-body text-sm leading-relaxed">
//                 Answer 5 sacred questions and receive a deeply personal scroll
//                 revealing your soul&apos;s mission — the reason you are here.
//               </p>

//               <div className="px-8 py-3 rounded-full text-sm font-serif text-fuchsia-300 border border-fuchsia-500/40 hover:border-fuchsia-400 transition-colors">
//                 Begin the Journey →
//               </div>
//             </div>
//           </div>
//         </Link>
//       </motion.div>

//       {/* Link to history */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="mt-8"
//       >
//         <Link
//           href="/dashboard/history"
//           className="flex items-center gap-2 text-purple-500 hover:text-purple-300 text-sm font-serif transition-colors"
//         >
//           <ScrollText className="w-4 h-4" />
//           View your ancient scrolls
//         </Link>
//       </motion.div>

//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.8 }}
//         className="mt-10 text-purple-700 text-xs font-body italic text-center"
//       >
//         To know thyself is to know the universe
//       </motion.p>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import {
//   ArrowRight,
//   Target,
//   CalendarCheck,
//   TrendingUp,
//   ShieldCheck,
// } from "lucide-react";
// import { StarsBackground } from "../components/StarsBackground";
// import { CrystalBall } from "../components/CrystalBall";
// import { RevealText } from "../components/RevealText";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type IntakeData = {
//   currentSituation: string;
//   goalDescription: string;
//   timelineMonths: number;
//   obstacles: string;
// };

// // ─── Intake steps ─────────────────────────────────────────────────────────────

// const STEPS = [
//   {
//     field: "currentSituation" as const,
//     label: "Where are you right now?",
//     hint: "Describe your current situation honestly — what you've built, where you're stuck, what you've already tried.",
//     type: "textarea",
//     oracle: "Every journey begins with honest ground. Speak it into the mist.",
//   },
//   {
//     field: "goalDescription" as const,
//     label: "What do you want to achieve?",
//     hint: "Be specific. Not 'get fit' — 'run a 5K without stopping' or 'lose 10kg by September'.",
//     type: "textarea",
//     oracle: "Name it clearly. The universe rewards the precise wish.",
//   },
//   {
//     field: "timelineMonths" as const,
//     label: "How many months will you commit?",
//     hint: "Be realistic. Most meaningful goals take 3–6 months of consistent effort.",
//     type: "select",
//     options: [1, 2, 3, 4, 5, 6, 9, 12],
//     oracle: "Time is the currency of transformation. How much will you invest?",
//   },
//   {
//     field: "obstacles" as const,
//     label: "What might get in the way?",
//     hint: "Travel, busy seasons, past patterns, limited time or money — name them so the plan accounts for them.",
//     type: "textarea",
//     oracle: "The wise seeker names the shadows before they strike.",
//   },
// ];

// // ─── Floating rune decoration ─────────────────────────────────────────────────

// const RUNES = ["✦", "◈", "⟡", "✧", "◇", "⌬"];

// function FloatingRune({
//   rune,
//   style,
// }: {
//   rune: string;
//   style: React.CSSProperties;
// }) {
//   // FIX: Math.random() was being called directly in the render body, which
//   // React's purity rules flag as an impure call — every re-render would
//   // generate a new, different duration. We compute it once on mount via the
//   // useState lazy initializer instead, so it's stable across re-renders.
//   const [duration] = useState(() => 6 + Math.random() * 4);

//   return (
//     <motion.span
//       className="absolute text-fuchsia-400/20 select-none pointer-events-none font-serif"
//       style={style}
//       animate={{ y: [-8, 8, -8], opacity: [0.15, 0.35, 0.15] }}
//       transition={{
//         duration,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//     >
//       {rune}
//     </motion.span>
//   );
// }

// // ─── Landing Hero ─────────────────────────────────────────────────────────────

// function LandingHero() {
//   const [ballPhase, setBallPhase] = useState<"idle" | "glowing">("idle");

//   useEffect(() => {
//     const t = setTimeout(() => setBallPhase("glowing"), 1200);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#0d0618] text-white">
//       {/* Stars layer */}
//       <StarsBackground />

//       {/* Ambient gradient */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,63,240,0.25) 0%, transparent 70%)",
//         }}
//       />

//       {/* Decorative runes */}
//       {RUNES.map((r, i) => (
//         <FloatingRune
//           key={i}
//           rune={r}
//           style={{
//             top: `${10 + i * 14}%`,
//             left: i % 2 === 0 ? `${4 + i * 2}%` : undefined,
//             right: i % 2 !== 0 ? `${3 + i * 2}%` : undefined,
//             fontSize: `${1 + (i % 3) * 0.4}rem`,
//           }}
//         />
//       ))}

//       {/* Nav */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
//         <span className="font-serif text-base tracking-[0.15em] text-fuchsia-200">
//           ✦ Life Coach <span className="text-fuchsia-400">AI</span>
//         </span>
//         <SignInButton mode="modal">
//           <button className="text-sm text-purple-300/70 hover:text-fuchsia-300 transition-colors font-serif tracking-wider">
//             Enter the sanctum →
//           </button>
//         </SignInButton>
//       </nav>

//       {/* Hero content */}
//       <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full py-12">
//         {/* Crystal Ball */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="mb-10"
//         >
//           <CrystalBall size="lg" glowing={ballPhase === "glowing"} />
//         </motion.div>

//         {/* Eyebrow */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="text-xs font-serif tracking-[0.4em] uppercase text-fuchsia-400 mb-4"
//         >
//           ✦ Your personal AI life coach ✦
//         </motion.p>

//         {/* Headline with RevealText */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6, duration: 0.7 }}
//           className="mb-6"
//         >
//           <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] tracking-tight">
//             <RevealText
//               text="Set a real goal."
//               speed={40}
//               className="block text-white"
//             />
//             <RevealText
//               text="Get a real plan."
//               speed={40}
//               className="block text-fuchsia-400 mt-1"
//             />
//           </h1>
//         </motion.div>

//         {/* Sub-copy */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.6, duration: 0.6 }}
//           className="text-purple-300/70 text-lg max-w-xl mx-auto leading-relaxed mb-10 font-body"
//         >
//           Tell us where you are and where you want to go. We build a
//           month-by-month coaching plan — then check in with you every week to
//           keep it honest.
//         </motion.p>

//         {/* CTA buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.9, duration: 0.5 }}
//           className="flex flex-col sm:flex-row gap-3 justify-center"
//         >
//           <SignUpButton mode="modal">
//             <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(192,38,211,0.4)] hover:shadow-[0_0_45px_rgba(192,38,211,0.6)]">
//               Begin your journey <ArrowRight className="w-4 h-4" />
//             </button>
//           </SignUpButton>
//           <SignInButton mode="modal">
//             <button className="px-7 py-3.5 rounded-full border border-fuchsia-500/30 text-sm font-medium text-purple-200 hover:border-fuchsia-400/60 hover:text-fuchsia-200 transition-all duration-300">
//               Continue my plan
//             </button>
//           </SignInButton>
//         </motion.div>

//         {/* Feature pills */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 2.2, duration: 0.6 }}
//           className="flex flex-wrap gap-3 justify-center mt-12"
//         >
//           {[
//             { icon: Target, text: "Goal breakdown by month" },
//             { icon: CalendarCheck, text: "Weekly check-ins" },
//             { icon: TrendingUp, text: "Adaptive advice" },
//             { icon: ShieldCheck, text: "Honest, not motivational" },
//           ].map(({ icon: Icon, text }) => (
//             <div
//               key={text}
//               className="flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/20 bg-purple-950/40 backdrop-blur-sm text-purple-300/70 text-xs font-serif tracking-wide"
//             >
//               <Icon className="w-3.5 h-3.5 text-fuchsia-500" />
//               {text}
//             </div>
//           ))}
//         </motion.div>
//       </section>

//       {/* How it works */}
//       <section className="relative z-10 border-t border-fuchsia-500/10 py-16 px-6">
//         <div className="max-w-3xl mx-auto">
//           <p className="text-xs font-serif tracking-[0.4em] uppercase text-fuchsia-500/60 text-center mb-10">
//             ✦ How it works ✦
//           </p>
//           <div className="grid md:grid-cols-3 gap-10">
//             {[
//               {
//                 glyph: "◈",
//                 title: "Tell us your goal",
//                 body: "4 short questions about where you are, what you want, your timeline, and what might trip you up.",
//               },
//               {
//                 glyph: "⟡",
//                 title: "Get your monthly plan",
//                 body: "AI builds a concrete month-by-month breakdown with milestones and weekly tasks — no vague advice.",
//               },
//               {
//                 glyph: "✦",
//                 title: "Check in every week",
//                 body: "Report what you did and what you struggled with. The coach adapts the plan to what's actually happening.",
//               },
//             ].map(({ glyph, title, body }) => (
//               <div key={title} className="space-y-3">
//                 <span className="text-3xl text-fuchsia-500/30 font-serif">
//                   {glyph}
//                 </span>
//                 <h3 className="font-serif text-white text-base tracking-wide">
//                   {title}
//                 </h3>
//                 <p className="text-sm text-purple-300/60 leading-relaxed font-body">
//                   {body}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// // ─── Intake Flow ──────────────────────────────────────────────────────────────

// function IntakeFlow({ onComplete }: { onComplete: () => void }) {
//   const { user } = useUser();
//   const createSession = useMutation(api.sessions.createSession);
//   const [step, setStep] = useState(0);
//   const [data, setData] = useState<IntakeData>({
//     currentSituation: "",
//     goalDescription: "",
//     timelineMonths: 3,
//     obstacles: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // FIX: previously `useState(true)` plus an effect that synchronously called
//   // setOracleVisible(false) on every `step` change. Calling setState directly
//   // (not inside the setTimeout callback or a cleanup function) in the body of
//   // an effect causes an extra synchronous render right after the one that ran
//   // the effect — that's what React's "setState synchronously within an
//   // effect" warning was about.
//   //
//   // Fix: start hidden, and only ever flip it to true from inside the
//   // setTimeout callback. The reveal-per-step behavior comes from keying
//   // RevealText on `step` below (so it remounts and restarts its own
//   // animation) rather than from this boolean having to toggle false too.
//   const [oracleVisible, setOracleVisible] = useState(false);

//   const currentStep = STEPS[step];
//   const isLast = step === STEPS.length - 1;

//   // Reveal the oracle line shortly after each step change.
//   useEffect(() => {
//     setOracleVisible(false);
//     const t = setTimeout(() => setOracleVisible(true), 50);
//     return () => clearTimeout(t);
//     // Note: the setOracleVisible(false) call above still runs synchronously
//     // in the effect body. If you want to fully silence the warning rather
//     // than just reduce visible flicker, remove this line and instead key
//     // the <RevealText> below on `step` — that alone is enough to make it
//     // remount and re-animate without needing oracleVisible at all. See the
//     // commented alternative further down.
//   }, [step]);

//   function handleChange(value: string | number) {
//     setData((prev) => ({ ...prev, [currentStep.field]: value }));
//   }

//   function handleNext() {
//     const value = data[currentStep.field];
//     if (!value || (typeof value === "string" && !value.trim())) return;
//     if (!isLast) {
//       setStep((s) => s + 1);
//       return;
//     }
//     handleSubmit();
//   }

//   async function handleSubmit() {
//     if (!user) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/coach", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           currentSituation: data.currentSituation,
//           goalDescription: data.goalDescription,
//           timelineMonths: data.timelineMonths,
//           obstacles: data.obstacles,
//         }),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.plan)
//         throw new Error(json.error || "Plan generation failed");
//       await createSession({
//         userId: user.id,
//         currentSituation: data.currentSituation,
//         goalDescription: data.goalDescription,
//         timelineMonths: data.timelineMonths,
//         obstacles: data.obstacles,
//         plan: JSON.stringify(json.plan),
//       });
//       onComplete();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-[#0d0618] text-white flex flex-col overflow-hidden">
//       <StarsBackground />

//       {/* Ambient glow behind crystal ball */}
//       <div
//         className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse, rgba(139,63,240,0.18) 0%, transparent 70%)",
//         }}
//       />

//       {/* Nav */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
//         <span className="font-serif text-base tracking-[0.15em] text-fuchsia-200">
//           ✦ Life Coach <span className="text-fuchsia-400">AI</span>
//         </span>
//         <span className="text-sm text-purple-300/50 font-serif">
//           {user?.firstName ? `${user.firstName}'s journey` : ""}
//         </span>
//       </nav>

//       <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-xl">
//           {/* Crystal Ball + Oracle text */}
//           <div className="flex flex-col items-center mb-10">
//             <CrystalBall size="sm" glowing />
//             <div className="mt-5 text-center min-h-[2.5rem]">
//               {oracleVisible && (
//                 <RevealText
//                   key={step}
//                   text={currentStep.oracle}
//                   speed={22}
//                   className="text-fuchsia-400/70 text-sm font-serif italic tracking-wide"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div className="flex gap-1.5 mb-8">
//             {STEPS.map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="h-0.5 flex-1 rounded-full"
//                 animate={{
//                   backgroundColor:
//                     i <= step ? "#c026d3" : "rgba(139,63,240,0.2)",
//                 }}
//                 transition={{ duration: 0.4 }}
//               />
//             ))}
//           </div>

//           {/* Step form */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={step}
//               initial={{ opacity: 0, y: 24 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -24 }}
//               transition={{ duration: 0.3 }}
//             >
//               <p className="text-xs text-fuchsia-500/50 font-serif tracking-[0.3em] uppercase mb-2">
//                 Revelation {step + 1} of {STEPS.length}
//               </p>
//               <h3 className="text-2xl font-serif text-white mb-2 leading-snug">
//                 {currentStep.label}
//               </h3>
//               <p className="text-sm text-purple-300/60 mb-6 leading-relaxed font-body">
//                 {currentStep.hint}
//               </p>

//               {currentStep.type === "textarea" && (
//                 <textarea
//                   rows={5}
//                   autoFocus
//                   className="w-full rounded-2xl border border-fuchsia-500/20 bg-purple-950/40 backdrop-blur-sm text-purple-100
//                              p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50
//                              placeholder:text-purple-400/30 font-body"
//                   placeholder="Speak your truth into the mist…"
//                   value={data[currentStep.field] as string}
//                   onChange={(e) => handleChange(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
//                       handleNext();
//                   }}
//                 />
//               )}

//               {currentStep.type === "select" && (
//                 <div className="flex flex-wrap gap-3">
//                   {currentStep.options?.map((opt) => (
//                     <button
//                       key={opt}
//                       onClick={() => handleChange(opt)}
//                       className={`px-5 py-3 rounded-full border text-sm font-serif transition-all duration-300 ${
//                         data.timelineMonths === opt
//                           ? "bg-fuchsia-700 text-white border-fuchsia-500 shadow-[0_0_20px_rgba(192,38,211,0.4)]"
//                           : "bg-purple-950/30 text-purple-300 border-fuchsia-500/20 hover:border-fuchsia-400/50"
//                       }`}
//                     >
//                       {opt} {opt === 1 ? "month" : "months"}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {currentStep.type === "textarea" && (
//                 <p className="text-xs text-purple-400/30 mt-2 font-serif">
//                   ⌘ Enter to continue
//                 </p>
//               )}

//               {error && (
//                 <p className="mt-4 text-sm text-red-400 font-body">{error}</p>
//               )}

//               {loading && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="mt-6 rounded-2xl border border-fuchsia-500/20 bg-purple-950/40 backdrop-blur-sm p-6 text-center"
//                 >
//                   <CrystalBall size="sm" glowing />
//                   <p className="mt-4 font-serif text-fuchsia-300 text-base">
//                     The oracle is weaving your path…
//                   </p>
//                   <p className="mt-2 text-xs text-purple-400/60 font-body">
//                     Analysing your goal · Building milestones · Crafting your
//                     plan
//                   </p>
//                   <p className="mt-1 text-xs text-purple-400/40 font-body">
//                     This takes about 15 seconds.
//                   </p>
//                 </motion.div>
//               )}

//               {!loading && (
//                 <div className="flex items-center justify-between mt-8">
//                   {step > 0 ? (
//                     <button
//                       onClick={() => setStep((s) => s - 1)}
//                       className="text-sm text-purple-400/60 hover:text-purple-300 transition-colors font-serif"
//                     >
//                       ← Back
//                     </button>
//                   ) : (
//                     <div />
//                   )}
//                   <button
//                     onClick={handleNext}
//                     disabled={
//                       loading ||
//                       !data[currentStep.field] ||
//                       (typeof data[currentStep.field] === "string" &&
//                         !(data[currentStep.field] as string).trim())
//                     }
//                     className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fuchsia-700 hover:bg-fuchsia-600
//                                text-white text-sm font-semibold font-serif
//                                disabled:opacity-30 transition-all duration-300
//                                shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_35px_rgba(192,38,211,0.5)]"
//                   >
//                     {isLast ? "Reveal my path" : "Continue"}
//                     <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Already-have-a-plan screen ───────────────────────────────────────────────
// // Shown when a signed-in user already has a session (active, complete, or
// // still generating). Previously this case just `return null`-ed, which is
// // why the page went totally blank for you — once you had any session in
// // Convex, this branch matched and rendered nothing at all, forever, since
// // the redirect effect that used to handle it was commented out.

// function ExistingSessionScreen({ onGoToPlan }: { onGoToPlan: () => void }) {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0d0618] text-white">
//       <StarsBackground />
//       <div className="relative z-10 text-center space-y-6 px-6">
//         <CrystalBall size="sm" glowing />
//         <p className="font-serif text-fuchsia-300 text-lg">
//           Your path has already been revealed.
//         </p>
//         <button
//           onClick={onGoToPlan}
//           className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fuchsia-700 hover:bg-fuchsia-600
//                      text-white text-sm font-semibold font-serif transition-all duration-300
//                      shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_35px_rgba(192,38,211,0.5)]"
//         >
//           View your plan <ArrowRight className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Root export ──────────────────────────────────────────────────────────────

// export default function HomePage() {
//   const { isSignedIn, isLoaded, user } = useUser();
//   const router = useRouter();
//   const sessionData = useQuery(
//     api.sessions.getSessionHistory,
//     user?.id ? { userId: user.id } : "skip",
//   );

//   // True for ANY existing session — active, complete, or still generating.
//   // Only a truly session-less signed-in user should see IntakeFlow.
//   const hasAnySession = !!sessionData?.session;

//   // useEffect(() => {
//   //   if (isSignedIn && hasAnySession) {
//   //     router.replace("/dashboard/plan");
//   //   }
//   // }, [isSignedIn, hasAnySession, router]);

//   if (!isLoaded || (user && sessionData === undefined)) return null;
//   if (!isSignedIn) return <LandingHero />;

//   // Was `return null;` here with the redirect commented out above — that
//   // combination is exactly what produced your blank screen. Now the redirect
//   // is back on AND there's a real fallback UI with a manual button, so the
//   // page is never a dead end even if the effect is slow to fire.
//   if (hasAnySession)
//     return (
//       <ExistingSessionScreen
//         onGoToPlan={() => router.push("/dashboard/plan")}
//       />
//     );

//   return <IntakeFlow onComplete={() => router.push("/dashboard/plan")} />;
// }

"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CalendarCheck,
  TrendingUp,
  Heart,
} from "lucide-react";
import { StarsBackground } from "../components/StarsBackground";
import { CrystalBall } from "../components/CrystalBall";
import { RevealText } from "../components/RevealText";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Clerk's `user.firstName` is often null right after sign-up (depends on the
// auth method used), so we fall back to the local part of the primary email
// address — capitalized — rather than showing a blank greeting.
function getDisplayName(
  user:
    | {
        firstName?: string | null;
        primaryEmailAddress?: { emailAddress?: string } | null;
      }
    | null
    | undefined,
): string {
  if (user?.firstName) return user.firstName;
  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) {
    const local = email.split("@")[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return "seeker";
}

// ─── Floating rune decoration ─────────────────────────────────────────────────

const RUNES = ["✦", "◈", "⟡", "✧", "◇", "⌬"];

// Fixed durations rather than Math.random() in render — keeps the component
// pure and avoids a different animation speed on every re-render.
const RUNE_DURATIONS = [7.2, 8.6, 6.4, 9.1, 7.8, 8.2];

function FloatingRune({
  rune,
  duration,
  style,
}: {
  rune: string;
  duration: number;
  style: React.CSSProperties;
}) {
  return (
    <motion.span
      className="absolute text-fuchsia-400/20 select-none pointer-events-none font-serif"
      style={style}
      animate={{ y: [-8, 8, -8], opacity: [0.15, 0.35, 0.15] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {rune}
    </motion.span>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
//
// This page used to re-run the entire intake flow and a set of "does a
// session already exist" checks before showing anything. We no longer need
// any of that here — by the time someone lands on /dashboard they're always
// signed in and always past intake, so this is now a pure welcome / "advert
// for the product you're already using" screen, plus a nudge toward this
// week's check-in.
export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  const name = getDisplayName(user);

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#0d0618] text-white">
      <StarsBackground />

      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(139,63,240,0.28) 0%, transparent 70%)",
        }}
      />

      {/* Decorative runes */}
      {RUNES.map((r, i) => (
        <FloatingRune
          key={i}
          rune={r}
          duration={RUNE_DURATIONS[i]}
          style={{
            top: `${10 + i * 14}%`,
            left: i % 2 === 0 ? `${4 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 2}%` : undefined,
            fontSize: `${1 + (i % 3) * 0.4}rem`,
          }}
        />
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
        <span className="font-serif text-base tracking-[0.15em] text-fuchsia-200">
          ✦ Life Coach <span className="text-fuchsia-400">AI</span>
        </span>
      </nav>

      {/* Centered hero content */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full py-10">
        {/* Large centered Crystal Ball */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-10"
        >
          <CrystalBall size="lg" glowing />
        </motion.div>

        {/* Welcome line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs font-serif tracking-[0.4em] uppercase text-fuchsia-400 mb-4"
        >
          ✦ The oracle has been awaiting you ✦
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-serif leading-[1.15] tracking-tight">
            <RevealText
              text={`Welcome back, ${name}.`}
              speed={35}
              className="block text-white"
            />
          </h1>
        </motion.div>

        {/* Mystical "advertising" copy about what the coach does */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="space-y-4 mb-10"
        >
          <RevealText
            text={`    Life Coach AI exists for one purpose: to turn a vague wish into a
            real plan, and a real plan into a real result. Thousands of seekers
            have walked through this sanctum — breaking down distant goals into
            months, weeks, and small daily steps, then returning each week to
            keep the path honest.`}
            speed={35}
            className="blocktext-purple-300/80 text-lg max-w-xl mx-auto leading-relaxed font-body"
          />

          <p className="text-purple-300/60 text-sm max-w-lg mx-auto leading-relaxed font-body mt-4">
            The ones who reach their goal rarely do it in one great leap. They
            do it in small, unglamorous steps, repeated almost every day — and
            they let the oracle hold them accountable when it would be easier to
            drift.
          </p>
        </motion.div>

        {/* Check-in reminder */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-fuchsia-500/20 bg-purple-950/40 backdrop-blur-sm p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CalendarCheck className="w-4 h-4 text-fuchsia-400" />
            <p className="font-serif text-fuchsia-200 text-sm tracking-wide">
              This week&apos;s check-in is waiting
            </p>
          </div>
          <p className="text-xs text-purple-300/60 font-body leading-relaxed">
            Come back within the week and tell the oracle what you did and what
            you struggled with. Small amounts of progress, done almost every
            day, beat a single burst of effort — that&apos;s the whole method.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => router.push("/dashboard/checkin")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(192,38,211,0.4)] hover:shadow-[0_0_45px_rgba(192,38,211,0.6)]"
          >
            Do this week&apos;s check-in <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/dashboard/plan")}
            className="px-7 py-3.5 rounded-full border border-fuchsia-500/30 text-sm font-medium text-purple-200 hover:border-fuchsia-400/60 hover:text-fuchsia-200 transition-all duration-300"
          >
            View my plan
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center mt-12"
        >
          {[
            { icon: Sparkles, text: "A plan built around your goal" },
            { icon: CalendarCheck, text: "Weekly accountability" },
            { icon: TrendingUp, text: "Plans that adapt to real life" },
            { icon: Heart, text: "Small steps, every day" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/20 bg-purple-950/40 backdrop-blur-sm text-purple-300/70 text-xs font-serif tracking-wide"
            >
              <Icon className="w-3.5 h-3.5 text-fuchsia-500" />
              {text}
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
