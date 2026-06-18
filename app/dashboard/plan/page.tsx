// app/dashboard/plan/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {
  Calendar,
  History,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import GoalIntakeForm from "@/app/components/GoalIntakeForm";
import MonthlyPlanCard from "@/app/components/MonthlyPlanCard";
import DeadlineTracker from "@/app/components/DeadlineTracker";

export default function PlanPage() {
  const { user } = useUser();
  const data = useQuery(
    api.sessions.getSessionHistory,
    user ? { userId: user.id } : "skip",
  );

  // Lets someone with a complete/abandoned session jump straight back into
  // the intake flow without waiting on a route change.
  const [startingNew, setStartingNew] = useState(false);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (user && data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const session = data?.session ?? null;
  const noActiveGoal = !session || session.status === "abandoned";

  // ── No goal yet, abandoned, or explicitly starting over ───────────────────
  if (noActiveGoal || startingNew) {
    return <GoalIntakeForm onComplete={() => setStartingNew(false)} />;
  }

  // ── Goal complete ───────────────────────────────────────────────────────
  if (session.status === "complete") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center space-y-6"
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        <div className="space-y-2 max-w-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            Goal complete 🎉
          </h1>
          <p className="text-sm text-muted-foreground">
            {session.goalDescription}
          </p>
          <p className="text-sm text-muted-foreground">
            You finished a {session.timelineMonths}-month plan. Ready for
            what&apos;s next?
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            View your journey
          </Link>
          <button
            onClick={() => setStartingNew(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Start a new goal
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Plan not generated yet (defensive — intake form normally blocks on this) ─
  if (session.status === "generating" || !session.plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
        <p className="text-sm text-muted-foreground">
          Building your month-by-month plan…
        </p>
      </div>
    );
  }

  // ── Active plan ─────────────────────────────────────────────────────────
  const plan = session.plan; // narrowed non-null above
  const weekNumber = (data?.checkins.length ?? 0) + 1;

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Page title */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 space-y-2"
      >
        <p className="text-primary/70 text-xs tracking-[0.4em] uppercase font-semibold">
          Your Plan
        </p>
        <h1 className="text-3xl font-bold text-foreground max-w-xl mx-auto">
          {session.goalDescription}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {session.timelineMonths}-month journey · Month{" "}
          {session.currentMonth ?? 1} of {session.timelineMonths}
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── Next check-in ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/dashboard/checkin"
            className="block hover:opacity-90 transition-opacity"
          >
            <DeadlineTracker
              nextCheckinDate={session.nextCheckinDate}
              sessionStatus={session.status}
              weekNumber={weekNumber}
              variant="card"
            />
          </Link>
        </motion.div>

        {/* ── Month-by-month plan ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MonthlyPlanCard
            plan={plan}
            currentMonth={session.currentMonth ?? 1}
          />
        </motion.div>

        {/* ── Footer actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 pt-2"
        >
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Full history
          </Link>
          <button
            onClick={() => setStartingNew(true)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Abandon &amp; start over
          </button>
        </motion.div>
      </div>
    </div>
  );
}
