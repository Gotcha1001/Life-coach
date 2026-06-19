// // components/WeeklyCheckin.tsx
// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useUser } from "@clerk/nextjs";

// type EnergyLevel = "low" | "medium" | "high";

// type CheckinData = {
//   completedTasks: string;
//   struggles: string;
//   energyLevel: EnergyLevel;
//   wantsReframe: boolean;
// };

// type CoachAdvice = {
//   assessment: string;
//   advice: string;
//   focusTask: string;
//   encouragement: string;
// };

// type Props = {
//   sessionId: Id<"coachingSessions">;
//   goalDescription: string;
//   weekNumber: number;
//   currentMonth: number;
//   currentMilestone: string;
//   currentTask: string; // the week's target task from the plan
//   onComplete?: () => void;
// };

// const ENERGY_OPTIONS: { value: EnergyLevel; label: string; description: string }[] = [
//   { value: "low", label: "Low", description: "Drained, struggled to show up" },
//   { value: "medium", label: "Medium", description: "Decent, got things done" },
//   { value: "high", label: "High", description: "Locked in, felt unstoppable" },
// ];

// const STEPS = [
//   {
//     field: "completedTasks" as const,
//     label: "What did you actually do this week?",
//     hint: "Be specific. Don't say 'worked on it' — say what you finished, shipped, or attempted.",
//     type: "textarea",
//   },
//   {
//     field: "struggles" as const,
//     label: "What didn't work or felt hard?",
//     hint: "Honesty here is what makes the coaching useful. Nothing to be ashamed of.",
//     type: "textarea",
//   },
//   {
//     field: "energyLevel" as const,
//     label: "How was your energy this week?",
//     hint: "This helps calibrate what's realistic to ask of you next week.",
//     type: "energy",
//   },
//   {
//     field: "wantsReframe" as const,
//     label: "Did you hit a wall that needs a fresh approach?",
//     hint: "If the current strategy isn't working, we can explore a realistic alternative path.",
//     type: "reframe",
//   },
// ];

// export default function WeeklyCheckin({
//   sessionId,
//   goalDescription,
//   weekNumber,
//   currentMonth,
//   currentMilestone,
//   currentTask,
//   onComplete,
// }: Props) {
//   const { user } = useUser();
//   const saveCheckin = useMutation(api.sessions.saveCheckin);

//   const [step, setStep] = useState(0);
//   const [data, setData] = useState<CheckinData>({
//     completedTasks: "",
//     struggles: "",
//     energyLevel: "medium",
//     wantsReframe: false,
//   });
//   const [phase, setPhase] = useState<"form" | "loading" | "advice">("form");
//   const [advice, setAdvice] = useState<CoachAdvice | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const currentStep = STEPS[step];
//   const isLastStep = step === STEPS.length - 1;

//   function canAdvance() {
//     if (currentStep.type === "textarea") {
//       const val = data[currentStep.field as "completedTasks" | "struggles"];
//       return typeof val === "string" && val.trim().length > 0;
//     }
//     return true; // energy + reframe always have a default
//   }

//   async function handleSubmit() {
//     if (!user) return;
//     setPhase("loading");
//     setError(null);

//     try {
//       // 1. Fetch AI advice
//       const res = await fetch("/api/checkin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           goalDescription,
//           currentMonth,
//           weekNumber,
//           currentMilestone,
//           currentTask,
//           completedTasks: data.completedTasks,
//           struggles: data.struggles,
//           energyLevel: data.energyLevel,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to get coaching advice");

//       const { advice: parsed } = await res.json();

//       // 2. Save to Convex
//       await saveCheckin({
//         sessionId,
//         userId: user.id,
//         completedTasks: data.completedTasks,
//         struggles: data.struggles,
//         energyLevel: data.energyLevel,
//         wantsReframe: data.wantsReframe,
//         advice: JSON.stringify(parsed),
//         reframe: undefined,
//       });

//       setAdvice(parsed);
//       setPhase("advice");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//       setPhase("form");
//     }
//   }

//   if (phase === "loading") {
//     return (
//       <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-24">
//         <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
//         <p className="text-sm text-muted-foreground">Your coach is reviewing your week…</p>
//       </div>
//     );
//   }

//   if (phase === "advice" && advice) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 24 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-xl mx-auto space-y-5"
//       >
//         {/* Header */}
//         <div className="space-y-1">
//           <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
//             Week {weekNumber} — Coach Feedback
//           </p>
//           <h2 className="text-xl font-semibold text-foreground">Here&apos;s where you stand</h2>
//         </div>

//         {/* Assessment */}
//         <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
//           <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Assessment</p>
//           <p className="text-sm text-foreground leading-relaxed">{advice.assessment}</p>
//         </div>

//         {/* Advice */}
//         <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-1">
//           <p className="text-xs text-primary uppercase tracking-wide font-medium mb-2">For next week</p>
//           <p className="text-sm text-foreground leading-relaxed">{advice.advice}</p>
//         </div>

//         {/* Focus task */}
//         <div className="rounded-2xl border border-border bg-muted/40 p-5">
//           <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Your one priority</p>
//           <p className="text-sm font-medium text-foreground">{advice.focusTask}</p>
//         </div>

//         {/* Encouragement */}
//         <p className="text-sm text-muted-foreground italic px-1">{advice.encouragement}</p>

//         {/* Done */}
//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           onClick={onComplete}
//           className="w-full mt-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
//         >
//           Got it — see you next week
//         </motion.button>
//       </motion.div>
//     );
//   }

//   // Form phase
//   return (
//     <div className="w-full max-w-xl mx-auto space-y-6">
//       {/* Context strip */}
//       <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 space-y-0.5">
//         <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
//           Week {weekNumber} · Month {currentMonth}
//         </p>
//         <p className="text-sm text-foreground font-medium">{currentMilestone}</p>
//         <p className="text-xs text-muted-foreground mt-1">This week&apos;s target: {currentTask}</p>
//       </div>

//       {/* Step progress dots */}
//       <div className="flex gap-1.5">
//         {STEPS.map((_, i) => (
//           <div
//             key={i}
//             className={`h-1 flex-1 rounded-full transition-all duration-300 ${
//               i <= step ? "bg-primary" : "bg-border"
//             }`}
//           />
//         ))}
//       </div>

//       {/* Step content */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={step}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           transition={{ duration: 0.25 }}
//           className="space-y-4"
//         >
//           <div className="space-y-1">
//             <h2 className="text-lg font-semibold text-foreground">{currentStep.label}</h2>
//             <p className="text-sm text-muted-foreground">{currentStep.hint}</p>
//           </div>

//           {/* Textarea */}
//           {currentStep.type === "textarea" && (
//             <textarea
//               value={data[currentStep.field as "completedTasks" | "struggles"]}
//               onChange={(e) =>
//                 setData((prev) => ({ ...prev, [currentStep.field]: e.target.value }))
//               }
//               rows={5}
//               placeholder={
//                 currentStep.field === "completedTasks"
//                   ? "e.g. Finished the landing page copy, sent 3 cold emails, had one discovery call…"
//                   : "e.g. Kept procrastinating on the outreach, ran out of time Thursday…"
//               }
//               className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
//             />
//           )}

//           {/* Energy level */}
//           {currentStep.type === "energy" && (
//             <div className="grid grid-cols-3 gap-3">
//               {ENERGY_OPTIONS.map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setData((prev) => ({ ...prev, energyLevel: opt.value }))}
//                   className={`rounded-xl border p-4 text-left transition-all ${
//                     data.energyLevel === opt.value
//                       ? "border-primary bg-primary/5"
//                       : "border-border bg-card hover:bg-muted/40"
//                   }`}
//                 >
//                   <p className="text-sm font-semibold text-foreground">{opt.label}</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Reframe toggle */}
//           {currentStep.type === "reframe" && (
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { value: false, label: "No", description: "Current approach is working" },
//                 { value: true, label: "Yes", description: "I need a fresh angle" },
//               ].map((opt) => (
//                 <button
//                   key={String(opt.value)}
//                   onClick={() => setData((prev) => ({ ...prev, wantsReframe: opt.value }))}
//                   className={`rounded-xl border p-4 text-left transition-all ${
//                     data.wantsReframe === opt.value
//                       ? "border-primary bg-primary/5"
//                       : "border-border bg-card hover:bg-muted/40"
//                   }`}
//                 >
//                   <p className="text-sm font-semibold text-foreground">{opt.label}</p>
//                   <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
//                 </button>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </AnimatePresence>

//       {/* Error */}
//       {error && <p className="text-sm text-destructive">{error}</p>}

//       {/* Navigation */}
//       <div className="flex gap-3 pt-2">
//         {step > 0 && (
//           <button
//             onClick={() => setStep((s) => s - 1)}
//             className="px-5 py-2.5 rounded-xl border border-border text-sm text-foreground hover:bg-muted/40 transition-colors"
//           >
//             Back
//           </button>
//         )}
//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           disabled={!canAdvance()}
//           onClick={() => {
//             if (isLastStep) {
//               handleSubmit();
//             } else {
//               setStep((s) => s + 1);
//             }
//           }}
//           className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
//         >
//           {isLastStep ? "Submit & get feedback" : "Continue"}
//         </motion.button>
//       </div>
//     </div>
//   );
// }

// components/WeeklyCheckin.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
type EnergyLevel = "low" | "medium" | "high";
type CheckinData = {
  completedTasks: string;
  struggles: string;
  energyLevel: EnergyLevel;
  wantsReframe: boolean;
};
type CoachAdvice = {
  assessment: string;
  advice: string;
  focusTask: string;
  encouragement: string;
};
type Props = {
  sessionId: Id<"coachingSessions">;
  goalDescription: string;
  weekNumber: number;
  currentMonth: number;
  currentMilestone: string;
  currentTask: string; // the week's target task from the plan
  onComplete?: () => void;
};
const ENERGY_OPTIONS: {
  value: EnergyLevel;
  label: string;
  description: string;
}[] = [
  { value: "low", label: "Low", description: "Drained, struggled to show up" },
  { value: "medium", label: "Medium", description: "Decent, got things done" },
  { value: "high", label: "High", description: "Locked in, felt unstoppable" },
];
const STEPS = [
  {
    field: "completedTasks" as const,
    label: "What did you actually do this week?",
    hint: "Be specific. Don't say 'worked on it' — say what you finished, shipped, or attempted.",
    type: "textarea",
  },
  {
    field: "struggles" as const,
    label: "What didn't work or felt hard?",
    hint: "Honesty here is what makes the coaching useful. Nothing to be ashamed of.",
    type: "textarea",
  },
  {
    field: "energyLevel" as const,
    label: "How was your energy this week?",
    hint: "This helps calibrate what's realistic to ask of you next week.",
    type: "energy",
  },
  {
    field: "wantsReframe" as const,
    label: "Did you hit a wall that needs a fresh approach?",
    hint: "If the current strategy isn't working, we can explore a realistic alternative path.",
    type: "reframe",
  },
];
export default function WeeklyCheckin({
  sessionId,
  goalDescription,
  weekNumber,
  currentMonth,
  currentMilestone,
  currentTask,
  onComplete,
}: Props) {
  const { user } = useUser();
  const saveCheckin = useMutation(api.sessions.saveCheckin);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckinData>({
    completedTasks: "",
    struggles: "",
    energyLevel: "medium",
    wantsReframe: false,
  });
  const [phase, setPhase] = useState<"form" | "loading" | "advice">("form");
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  function canAdvance() {
    if (currentStep.type === "textarea") {
      const val = data[currentStep.field as "completedTasks" | "struggles"];
      return typeof val === "string" && val.trim().length > 0;
    }
    return true; // energy + reframe always have a default
  }
  async function handleSubmit() {
    if (!user) return;
    setPhase("loading");
    setError(null);
    try {
      // 1. Fetch AI advice
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalDescription,
          currentMonth,
          weekNumber,
          currentMilestone,
          currentTask,
          completedTasks: data.completedTasks,
          struggles: data.struggles,
          energyLevel: data.energyLevel,
        }),
      });
      if (!res.ok) throw new Error("Failed to get coaching advice");
      const { advice: parsed } = await res.json();
      // 2. Save to Convex
      await saveCheckin({
        sessionId,
        userId: user.id,
        completedTasks: data.completedTasks,
        struggles: data.struggles,
        energyLevel: data.energyLevel,
        wantsReframe: data.wantsReframe,
        advice: JSON.stringify(parsed),
        reframe: undefined,
      });
      setAdvice(parsed);
      setPhase("advice");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setPhase("form");
    }
  }
  if (phase === "loading") {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-24">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">
          Your coach is reviewing your week…
        </p>
      </div>
    );
  }
  if (phase === "advice" && advice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl mx-auto space-y-5"
      >
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Week {weekNumber} — Coach Feedback
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            Here&apos;s where you stand
          </h2>
        </div>
        {/* Assessment */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
            Assessment
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {advice.assessment}
          </p>
        </div>
        {/* Advice */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-1">
          <p className="text-xs text-primary uppercase tracking-wide font-medium mb-2">
            For next week
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {advice.advice}
          </p>
        </div>
        {/* Focus task */}
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
            Your one priority
          </p>
          <p className="text-sm font-medium text-foreground">
            {advice.focusTask}
          </p>
        </div>
        {/* Encouragement */}
        <p className="text-sm text-muted-foreground italic px-1">
          {advice.encouragement}
        </p>
        {/* Done */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
          className="w-full mt-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Got it — see you next week
        </motion.button>
      </motion.div>
    );
  }
  // Form phase
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Context strip */}
      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 space-y-0.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Week {weekNumber} · Month {currentMonth}
        </p>
        <p className="text-sm text-foreground font-medium">
          {currentMilestone}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This week&apos;s target: {currentTask}
        </p>
      </div>
      {/* Step progress dots */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              {currentStep.label}
            </h2>
            <p className="text-sm text-muted-foreground">{currentStep.hint}</p>
          </div>
          {/* Textarea */}
          {currentStep.type === "textarea" && (
            <textarea
              value={data[currentStep.field as "completedTasks" | "struggles"]}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  [currentStep.field]: e.target.value,
                }))
              }
              rows={5}
              placeholder={
                currentStep.field === "completedTasks"
                  ? "e.g. Finished the landing page copy, sent 3 cold emails, had one discovery call…"
                  : "e.g. Kept procrastinating on the outreach, ran out of time Thursday…"
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          )}
          {/* Energy level */}
          {currentStep.type === "energy" && (
            <div className="grid grid-cols-3 gap-3">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setData((prev) => ({ ...prev, energyLevel: opt.value }))
                  }
                  className={`rounded-xl border p-4 text-left transition-all ${
                    data.energyLevel === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          )}
          {/* Reframe toggle */}
          {currentStep.type === "reframe" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: false,
                  label: "No",
                  description: "Current approach is working",
                },
                {
                  value: true,
                  label: "Yes",
                  description: "I need a fresh angle",
                },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() =>
                    setData((prev) => ({ ...prev, wantsReframe: opt.value }))
                  }
                  className={`rounded-xl border p-4 text-left transition-all ${
                    data.wantsReframe === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-2.5 rounded-xl border border-border text-sm text-foreground hover:bg-muted/40 transition-colors"
          >
            Back
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canAdvance()}
          onClick={() => {
            if (isLastStep) {
              handleSubmit();
            } else {
              setStep((s) => s + 1);
            }
          }}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          {isLastStep ? "Submit & get feedback" : "Continue"}
        </motion.button>
      </div>
    </div>
  );
}
