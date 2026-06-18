"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowRight,
  Target,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

type IntakeData = {
  currentSituation: string;
  goalDescription: string;
  timelineMonths: number;
  obstacles: string;
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

function LandingHero() {
  return (
    <main className="min-h-screen bg-radial from-purple-500 to-indigo-900 text-foreground flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <span className="font-semibold text-base tracking-tight text-foreground">
          Life Coach <span className="text-primary">AI</span>
        </span>
        <SignInButton mode="modal">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in →
          </button>
        </SignInButton>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
            Your personal AI life coach
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
            Set a real goal.
            <br />
            <span className="text-primary">Get a real plan.</span>
          </h1>
          <p className="text-white text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Tell us where you are and where you want to go. We build a
            month-by-month coaching plan — then check in with you every week to
            keep it honest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
              Start for free <ArrowRight className="w-4 h-4" />
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-7 py-3.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all">
              Continue my plan
            </button>
          </SignInButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center mt-14"
        >
          {[
            { icon: Target, text: "Goal breakdown by month" },
            { icon: CalendarCheck, text: "Weekly check-ins" },
            { icon: TrendingUp, text: "Adaptive advice" },
            { icon: ShieldCheck, text: "Honest, not motivational" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-muted-foreground text-sm"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {text}
            </div>
          ))}
        </motion.div>
      </section>

      <section className="border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-10">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Tell us your goal",
                body: "4 short questions about where you are, what you want, your timeline, and what might trip you up.",
              },
              {
                num: "02",
                title: "Get your monthly plan",
                body: "AI builds a concrete month-by-month breakdown with milestones and weekly tasks — no vague advice.",
              },
              {
                num: "03",
                title: "Check in every week",
                body: "Report what you did and what you struggled with. The coach adapts the plan to what's actually happening.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="space-y-3">
                <span className="text-3xl font-bold text-primary/30">
                  {num}
                </span>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function IntakeFlow({ onComplete }: { onComplete: () => void }) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
        <span className="font-semibold text-base tracking-tight text-foreground">
          Life Coach <span className="text-primary">AI</span>
        </span>
        <span className="text-sm text-muted-foreground">
          {user?.firstName ? `Hi, ${user.firstName}` : ""}
        </span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
              Goal setup
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              Let&apos;s build your coaching plan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              4 questions — takes about 3 minutes.
            </p>
          </div>

          <div className="flex gap-1.5 mb-10">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-muted-foreground mb-1">
                Question {step + 1} of {STEPS.length}
              </p>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentStep.label}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {currentStep.hint}
              </p>

              {currentStep.type === "textarea" && (
                <textarea
                  rows={5}
                  autoFocus
                  className="w-full rounded-xl border border-border bg-card text-foreground
                             p-4 text-sm resize-none focus:outline-none focus:ring-2
                             focus:ring-primary placeholder:text-muted-foreground"
                  placeholder="Type your answer here..."
                  value={data[currentStep.field] as string}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleNext();
                  }}
                />
              )}

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

              {currentStep.type === "textarea" && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⌘ Enter to continue
                </p>
              )}

              {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}

              {loading && (
                <div className="mt-6 rounded-xl bg-card border border-border p-5 text-sm text-muted-foreground space-y-1.5">
                  <p className="font-medium text-foreground">
                    Building your plan…
                  </p>
                  <p>Analysing your goal and timeline.</p>
                  <p>Generating month-by-month milestones.</p>
                  <p>This takes about 15 seconds.</p>
                </div>
              )}

              {!loading && (
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
                    disabled={
                      loading ||
                      !data[currentStep.field] ||
                      (typeof data[currentStep.field] === "string" &&
                        !(data[currentStep.field] as string).trim())
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary
                               text-primary-foreground text-sm font-semibold
                               disabled:opacity-40 hover:opacity-90 transition-all"
                  >
                    {isLast ? "Build my plan" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const sessionData = useQuery(
    api.sessions.getSessionHistory,
    user?.id ? { userId: user.id } : "skip",
  );

  const hasActiveSession =
    !!sessionData?.session && sessionData.session.status === "active";

  // Redirect if user has an active session
  useEffect(() => {
    if (isSignedIn && hasActiveSession) {
      router.replace("/dashboard/plan");
    }
  }, [isSignedIn, hasActiveSession, router]);

  if (!isLoaded || (user && sessionData === undefined)) return null;

  if (!isSignedIn) return <LandingHero />;

  if (hasActiveSession) return null;

  return <IntakeFlow onComplete={() => router.push("/dashboard/plan")} />;
}
