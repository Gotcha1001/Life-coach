// // components/GoalIntakeForm.tsx

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";

// type IntakeData = {
//   currentSituation: string;
//   goalDescription: string;
//   timelineMonths: number;
//   obstacles: string;
// };

// type Props = {
//   onComplete: () => void; // called after session is saved — triggers navigation to plan view
// };

// const STEPS = [
//   {
//     field: "currentSituation" as const,
//     label: "Where are you right now?",
//     hint: "Describe your current situation honestly — what you've built, where you're stuck, what you've already tried.",
//     type: "textarea",
//   },
//   {
//     field: "goalDescription" as const,
//     label: "What do you want to achieve?",
//     hint: "Be specific. Not 'get fit' — 'run a 5K without stopping' or 'lose 10kg by September'.",
//     type: "textarea",
//   },
//   {
//     field: "timelineMonths" as const,
//     label: "How many months do you want to give yourself?",
//     hint: "Be realistic. Most meaningful goals take 3–6 months of consistent effort.",
//     type: "select",
//     options: [1, 2, 3, 4, 5, 6, 9, 12],
//   },
//   {
//     field: "obstacles" as const,
//     label: "What might get in the way?",
//     hint: "Travel, busy seasons, past patterns, limited time or money — name them now so the plan accounts for them.",
//     type: "textarea",
//   },
// ];

// export default function GoalIntakeForm({ onComplete }: Props) {
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

//   const currentStep = STEPS[step];
//   const isLast = step === STEPS.length - 1;

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
//       // 1. Generate the plan from the API
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
//       if (!res.ok || !json.plan) throw new Error(json.error || "Plan generation failed");

//       // 2. Save the session + plan to Convex
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
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-xl">

//         {/* Progress bar */}
//         <div className="flex gap-2 mb-10">
//           {STEPS.map((_, i) => (
//             <div
//               key={i}
//               className={`h-1 flex-1 rounded-full transition-all duration-500 ${
//                 i <= step ? "bg-primary" : "bg-muted"
//               }`}
//             />
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, y: 24 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -24 }}
//             transition={{ duration: 0.3 }}
//           >
//             <p className="text-sm text-muted-foreground mb-2">
//               Step {step + 1} of {STEPS.length}
//             </p>

//             <h2 className="text-2xl font-semibold text-foreground mb-2">
//               {currentStep.label}
//             </h2>

//             <p className="text-sm text-muted-foreground mb-6">
//               {currentStep.hint}
//             </p>

//             {/* Textarea input */}
//             {currentStep.type === "textarea" && (
//               <textarea
//                 rows={5}
//                 className="w-full rounded-xl border border-border bg-card text-foreground
//                            p-4 text-sm resize-none focus:outline-none focus:ring-2
//                            focus:ring-primary placeholder:text-muted-foreground"
//                 placeholder="Type your answer here..."
//                 value={data[currentStep.field] as string}
//                 onChange={(e) => handleChange(e.target.value)}
//               />
//             )}

//             {/* Month selector */}
//             {currentStep.type === "select" && (
//               <div className="flex flex-wrap gap-3">
//                 {currentStep.options?.map((opt) => (
//                   <button
//                     key={opt}
//                     onClick={() => handleChange(opt)}
//                     className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
//                       data.timelineMonths === opt
//                         ? "bg-primary text-primary-foreground border-primary"
//                         : "bg-card text-foreground border-border hover:border-primary"
//                     }`}
//                   >
//                     {opt} {opt === 1 ? "month" : "months"}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <p className="mt-4 text-sm text-destructive">{error}</p>
//             )}

//             {/* Navigation */}
//             <div className="flex items-center justify-between mt-8">
//               {step > 0 ? (
//                 <button
//                   onClick={() => setStep((s) => s - 1)}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   ← Back
//                 </button>
//               ) : (
//                 <div />
//               )}

//               <button
//                 onClick={handleNext}
//                 disabled={loading || !data[currentStep.field]}
//                 className="px-6 py-3 rounded-xl bg-primary text-primary-foreground
//                            text-sm font-medium disabled:opacity-40 hover:opacity-90
//                            transition-all"
//               >
//                 {loading
//                   ? "Building your plan..."
//                   : isLast
//                   ? "Generate My Plan"
//                   : "Next →"}
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// components/GoalIntakeForm.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
type IntakeData = {
  currentSituation: string;
  goalDescription: string;
  timelineMonths: number;
  obstacles: string;
};
type Props = {
  onComplete: () => void; // called after session is saved — triggers navigation to plan view
};
const STEPS = [
  {
    field: "currentSituation" as const,
    label: "Where are you right now?",
    hint: "Describe your current situation honestly — what you've built, where you're stuck, what you've already tried.",
    type: "textarea",
  },
  {
    field: "goalDescription" as const,
    label: "What do you want to achieve?",
    hint: "Be specific. Not 'get fit' — 'run a 5K without stopping' or 'lose 10kg by September'.",
    type: "textarea",
  },
  {
    field: "timelineMonths" as const,
    label: "How many months do you want to give yourself?",
    hint: "Be realistic. Most meaningful goals take 3–6 months of consistent effort.",
    type: "select",
    options: [1, 2, 3, 4, 5, 6, 9, 12],
  },
  {
    field: "obstacles" as const,
    label: "What might get in the way?",
    hint: "Travel, busy seasons, past patterns, limited time or money — name them now so the plan accounts for them.",
    type: "textarea",
  },
];
export default function GoalIntakeForm({ onComplete }: Props) {
  const { user } = useUser();
  const createSession = useMutation(api.sessions.createSession);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>({
    currentSituation: "",
    goalDescription: "",
    timelineMonths: 3,
    obstacles: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  function handleChange(value: string | number) {
    setData((prev) => ({ ...prev, [currentStep.field]: value }));
  }
  function handleNext() {
    const value = data[currentStep.field];
    if (!value || (typeof value === "string" && !value.trim())) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    handleSubmit();
  }
  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Generate the plan from the API
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSituation: data.currentSituation,
          goalDescription: data.goalDescription,
          timelineMonths: data.timelineMonths,
          obstacles: data.obstacles,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.plan)
        throw new Error(json.error || "Plan generation failed");
      // 2. Save the session + plan to Convex
      await createSession({
        userId: user.id,
        currentSituation: data.currentSituation,
        goalDescription: data.goalDescription,
        timelineMonths: data.timelineMonths,
        obstacles: data.obstacles,
        plan: JSON.stringify(json.plan),
      });
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {currentStep.label}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {currentStep.hint}
            </p>
            {/* Textarea input */}
            {currentStep.type === "textarea" && (
              <textarea
                rows={5}
                className="w-full rounded-xl border border-border bg-card text-foreground 
                           p-4 text-sm resize-none focus:outline-none focus:ring-2 
                           focus:ring-primary placeholder:text-muted-foreground"
                placeholder="Type your answer here..."
                value={data[currentStep.field] as string}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
            {/* Month selector */}
            {currentStep.type === "select" && (
              <div className="flex flex-wrap gap-3">
                {currentStep.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleChange(opt)}
                    className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                      data.timelineMonths === opt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {opt} {opt === 1 ? "month" : "months"}
                  </button>
                ))}
              </div>
            )}
            {/* Error */}
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleNext}
                disabled={loading || !data[currentStep.field]}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground 
                           text-sm font-medium disabled:opacity-40 hover:opacity-90 
                           transition-all"
              >
                {loading
                  ? "Building your plan..."
                  : isLast
                    ? "Generate My Plan"
                    : "Next →"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
