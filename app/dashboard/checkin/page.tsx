// app/dashboard/checkin/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import WeeklyCheckin from "@/app/components/WeeklyCheckin";
import DeadlineTracker from "@/app/components/DeadlineTracker";

export default function CheckinPage() {
  const { user } = useUser();

  const data = useQuery(
    api.sessions.getSessionHistory,
    user ? { userId: user.id } : "skip",
  );
  const session = data?.session ?? null;
  const checkins = data?.checkins ?? [];

  // Capture the current timestamp once, when the component first mounts.
  // useState's lazy initializer runs before the first render and is outside
  // the render function itself, so Date.now() is not called during render.
  const [mountedAt] = useState<number>(() => Date.now());

  // Sticky open state — stays true once opened so the advice screen isn't
  // yanked away when saveCheckin bumps nextCheckinDate.
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Pure derivation — no Date.now(), no refs, no effects.
  // mountedAt is plain state, safe to read during render.
  const isDue =
    !!session &&
    session.status === "active" &&
    !!session.nextCheckinDate &&
    session.nextCheckinDate <= mountedAt;

  // Derive the effective open state: latch true once isDue fires.
  // We never call setCheckinOpen here — we just fold isDue into the
  // boolean the rest of the render reads. setCheckinOpen is only called
  // from event handlers (handleComplete, the early check-in button).
  const showCheckin = checkinOpen || isDue || forceOpen;

  function handleComplete() {
    setCheckinOpen(false);
    setForceOpen(false);
    setJustCompleted(true);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (user && data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── No active goal to check in on ───────────────────────────────────────
  if (!session || session.status === "abandoned") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Nothing to check in on yet
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Set up a goal first and your weekly check-ins will show up here.
          </p>
        </div>
        <Link
          href="/dashboard/plan"
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Set up your goal →
        </Link>
      </div>
    );
  }

  // ── Goal already complete ───────────────────────────────────────────────
  if (session.status === "complete") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center space-y-5"
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Goal complete
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            {session.goalDescription}
          </p>
          <p className="text-sm text-muted-foreground">
            There&apos;s nothing left to check in on.
          </p>
        </div>
        <Link
          href="/dashboard/plan"
          className="text-sm text-primary font-medium hover:underline"
        >
          Back to your plan →
        </Link>
      </motion.div>
    );
  }

  const currentMonthData = session.plan?.months.find(
    (m) => m.month === session.currentMonth,
  );
  const weekNumber = checkins.length + 1;
  const weekInMonth = checkins.length % 4;
  const currentTask =
    currentMonthData?.tasks[weekInMonth] ??
    currentMonthData?.tasks[currentMonthData.tasks.length - 1] ??
    "Stay consistent with last week's task.";

  // ── Checkin in progress ──────────────────────────────────────────────────
  if (showCheckin && !justCompleted) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="checkin"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center px-4 py-10"
        >
          <WeeklyCheckin
            sessionId={session._id}
            goalDescription={session.goalDescription}
            weekNumber={weekNumber}
            currentMonth={session.currentMonth ?? 1}
            currentMilestone={currentMonthData?.milestone ?? ""}
            currentTask={currentTask}
            onComplete={handleComplete}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Not due yet ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/dashboard/plan"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to plan
        </Link>

        <AnimatePresence>
          {justCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm text-foreground">
                  Logged. See you at your next check-in.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Not due yet</h1>
          <p className="text-sm text-muted-foreground">
            Your next check-in opens automatically when it&apos;s time.
          </p>
        </div>

        <DeadlineTracker
          nextCheckinDate={session.nextCheckinDate}
          sessionStatus={session.status}
          weekNumber={weekNumber}
          variant="card"
        />

        <button
          onClick={() => setForceOpen(true)}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Check in early anyway
        </button>
      </div>
    </div>
  );
}
