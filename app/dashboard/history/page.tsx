"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Calendar,
  RotateCcw,
  Zap,
  Battery,
  BatteryLow,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EnergyLevel = "low" | "medium" | "high";

type WeeklyCheckin = {
  _id: string;
  weekNumber: number;
  checkinDate: number;
  completedTasks: string;
  struggles: string;
  energyLevel: EnergyLevel;
  wantsReframe: boolean;
  advice?: string;
  reframe?: string;
};

type MonthPlan = {
  month: number;
  milestone: string;
  tasks: string[];
  deadline: string;
};

type MonthlyPlan = {
  months: MonthPlan[];
};

type Session = {
  _id: string;
  goalDescription: string;
  timelineMonths: number;
  status: "generating" | "active" | "complete" | "abandoned";
  currentMonth?: number;
  plan: MonthlyPlan | null;
  createdAt: number;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EnergyBadge({ level }: { level: EnergyLevel }) {
  const config = {
    low: {
      icon: BatteryLow,
      label: "Low energy",
      className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    medium: {
      icon: Battery,
      label: "Medium energy",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    high: {
      icon: Zap,
      label: "High energy",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  }[level];

  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${config.className}`}
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
}

function WeekCard({
  checkin,
  isLast,
}: {
  checkin: WeeklyCheckin;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(checkin.checkinDate));

  // Parse advice if JSON, otherwise treat as plain text
  let parsedAdvice: {
    assessment?: string;
    advice?: string;
    focusTask?: string;
    encouragement?: string;
  } | null = null;
  if (checkin.advice) {
    try {
      parsedAdvice = JSON.parse(checkin.advice);
    } catch {
      parsedAdvice = { advice: checkin.advice };
    }
  }

  // Parse reframe if JSON
  let parsedReframe: {
    reframe?: string;
    alternativeApproach?: string;
    mindsetShift?: string;
  } | null = null;
  if (checkin.reframe) {
    try {
      parsedReframe = JSON.parse(checkin.reframe);
    } catch {
      parsedReframe = { reframe: checkin.reframe };
    }
  }

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center z-10">
          <CheckCircle2 size={15} className="text-indigo-400" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/30 to-transparent mt-1" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <motion.div
          layout
          className="rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden"
        >
          {/* Header — always visible */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-start justify-between p-4 text-left hover:bg-white/4 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Week {checkin.weekNumber}
                </span>
                <EnergyBadge level={checkin.energyLevel} />
                {checkin.wantsReframe && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border bg-violet-500/10 text-violet-400 border-violet-500/20 font-medium">
                    <RotateCcw size={10} />
                    Reframed
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 flex items-center gap-1">
                <Calendar size={11} />
                {date}
              </p>
            </div>
            <div className="text-white/30 flex-shrink-0 mt-0.5">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </button>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-white/6 pt-4">
                  {/* What they did */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      Completed
                    </p>
                    <p className="text-sm text-white/75 leading-relaxed">
                      {checkin.completedTasks}
                    </p>
                  </div>

                  {/* Struggles */}
                  {checkin.struggles && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white/50 flex items-center gap-1.5">
                        <AlertTriangle size={11} className="text-amber-400" />
                        Struggles
                      </p>
                      <p className="text-sm text-white/75 leading-relaxed">
                        {checkin.struggles}
                      </p>
                    </div>
                  )}

                  {/* Coach Advice */}
                  {parsedAdvice && (
                    <div className="rounded-lg bg-indigo-500/8 border border-indigo-500/15 p-3 space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                        <MessageSquare size={11} />
                        Coach Advice
                      </p>
                      {parsedAdvice.assessment && (
                        <p className="text-xs text-white/60 italic">
                          {parsedAdvice.assessment}
                        </p>
                      )}
                      {parsedAdvice.advice && (
                        <p className="text-sm text-white/80 leading-relaxed">
                          {parsedAdvice.advice}
                        </p>
                      )}
                      {parsedAdvice.focusTask && (
                        <div className="pt-1">
                          <p className="text-xs text-white/40 uppercase tracking-wide font-semibold mb-0.5">
                            Focus this week
                          </p>
                          <p className="text-sm text-indigo-300">
                            {parsedAdvice.focusTask}
                          </p>
                        </div>
                      )}
                      {parsedAdvice.encouragement && (
                        <p className="text-xs text-white/50 italic border-t border-white/6 pt-2 mt-2">
                          {parsedAdvice.encouragement}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reframe */}
                  {parsedReframe && (
                    <div className="rounded-lg bg-violet-500/8 border border-violet-500/15 p-3 space-y-2">
                      <p className="text-xs font-semibold text-violet-400 flex items-center gap-1.5">
                        <RotateCcw size={11} />
                        Reframe
                      </p>
                      {parsedReframe.reframe && (
                        <p className="text-sm text-white/80 leading-relaxed">
                          {parsedReframe.reframe}
                        </p>
                      )}
                      {parsedReframe.alternativeApproach && (
                        <div className="pt-1">
                          <p className="text-xs text-white/40 uppercase tracking-wide font-semibold mb-0.5">
                            Alternative approach
                          </p>
                          <p className="text-sm text-violet-300">
                            {parsedReframe.alternativeApproach}
                          </p>
                        </div>
                      )}
                      {parsedReframe.mindsetShift && (
                        <p className="text-xs text-white/50 italic border-t border-white/6 pt-2 mt-2">
                          💡 {parsedReframe.mindsetShift}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function MonthBlock({
  monthIndex,
  plan,
  checkins,
  totalMonths,
  currentMonth,
}: {
  monthIndex: number;
  plan?: MonthPlan;
  checkins: WeeklyCheckin[];
  totalMonths: number;
  currentMonth?: number;
}) {
  const [open, setOpen] = useState(monthIndex === (currentMonth ?? 1));
  const hasCheckins = checkins.length > 0;
  const isCurrent = monthIndex === currentMonth;
  const isFuture = currentMonth !== undefined && monthIndex > currentMonth;
  const isPast = hasCheckins && !isCurrent;

  const deadline = plan?.deadline
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(plan.deadline))
    : null;

  return (
    <div>
      {/* Month header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 text-left group mb-3"
        disabled={isFuture && !hasCheckins}
      >
        {/* Month dot */}
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
            isFuture && !hasCheckins
              ? "border-white/10 bg-white/4"
              : isPast
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-indigo-500/40 bg-indigo-500/15"
          }`}
        >
          {isPast ? (
            <CheckCircle2 size={14} className="text-emerald-400" />
          ) : isFuture && !hasCheckins ? (
            <Circle size={12} className="text-white/20" />
          ) : (
            <span className="text-xs font-bold text-indigo-400">
              {monthIndex}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold ${
                isFuture && !hasCheckins ? "text-white/25" : "text-white/80"
              }`}
            >
              Month {monthIndex}
              {isCurrent && (
                <span className="ml-2 text-xs text-indigo-400 font-normal">
                  · current
                </span>
              )}
            </span>
            {plan?.milestone && (
              <span
                className={`text-xs truncate max-w-[200px] ${
                  isFuture && !hasCheckins ? "text-white/20" : "text-white/40"
                }`}
              >
                {plan.milestone}
              </span>
            )}
          </div>
          {deadline && !isFuture && (
            <p className="text-xs text-white/30 mt-0.5">Due {deadline}</p>
          )}
        </div>

        {/* Check count + toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasCheckins && (
            <span className="text-xs text-white/30">
              {checkins.length} week{checkins.length !== 1 ? "s" : ""}
            </span>
          )}
          {!isFuture && (
            <span className="text-white/20 group-hover:text-white/40 transition-colors">
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          )}
        </div>
      </button>

      {/* Month content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="month-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-8 border-l border-white/6">
              {/* Plan tasks */}
              {plan?.tasks && plan.tasks.length > 0 && (
                <div className="mb-5 rounded-lg border border-white/6 bg-white/3 p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
                    Planned tasks
                  </p>
                  {plan.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/25 mt-2 flex-shrink-0" />
                      <p className="text-xs text-white/55 leading-relaxed">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Weekly check-ins */}
              {hasCheckins ? (
                <div className="space-y-0">
                  {checkins.map((checkin, i) => (
                    <WeekCard
                      key={checkin._id}
                      checkin={checkin}
                      isLast={i === checkins.length - 1}
                    />
                  ))}
                </div>
              ) : isFuture ? (
                <div className="border border-dashed border-white/8 rounded-xl p-4 mb-8 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0">
                    <Circle size={11} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/25">
                    {plan?.tasks?.length
                      ? `${plan.tasks.length} task${plan.tasks.length !== 1 ? "s" : ""} planned`
                      : "Awaiting check-ins"}
                  </p>
                </div>
              ) : (
                <div className="border border-dashed border-white/8 rounded-xl p-4 mb-8 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0">
                    <Circle size={11} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/25">
                    No check-ins yet this month
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressHeader({
  session,
  totalWeeks,
  weeksRemaining,
  progressPercent,
}: {
  session: Session;
  totalWeeks: number;
  weeksRemaining: number;
  progressPercent: number;
}) {
  const startDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(session.createdAt));

  const statusConfig = {
    generating: { label: "Generating plan…", color: "text-amber-400" },
    active: { label: "Active", color: "text-indigo-400" },
    complete: { label: "Complete ✓", color: "text-emerald-400" },
    abandoned: { label: "Paused", color: "text-white/40" },
  }[session.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
            Goal
          </p>
          <p className="text-base text-white/90 font-medium leading-snug">
            {session.goalDescription}
          </p>
          <p className="text-xs text-white/35 flex items-center gap-1.5 pt-0.5">
            <Calendar size={11} />
            Started {startDate} · {session.timelineMonths}-month journey
          </p>
        </div>
        <span
          className={`text-xs font-semibold flex-shrink-0 ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/35">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={11} />
            {totalWeeks} week{totalWeeks !== 1 ? "s" : ""} logged
          </span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
          />
        </div>
        <p className="text-xs text-white/30 text-right">
          {weeksRemaining} week{weeksRemaining !== 1 ? "s" : ""} remaining
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";

  const data = useQuery(
    api.sessions.getSessionHistory,
    clerkId ? { userId: clerkId } : "skip",
  );

  // Loading
  if (data === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-white/40 text-sm">Loading your journey…</p>
        </div>
      </div>
    );
  }

  // No session at all
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Sparkles size={24} className="text-indigo-400" />
          </div>
          <h2 className="text-white/80 font-semibold text-lg">
            No journey yet
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Set a goal to start your coaching journey. Your session timeline and
            weekly progress will appear here.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-500/25 transition-colors"
          >
            <Target size={14} />
            Start a session
          </a>
        </motion.div>
      </div>
    );
  }

  const {
    session,
    checkins,
    checkinsByMonth,
    totalWeeks,
    weeksRemaining,
    progressPercent,
  } = data;
  const months = Array.from(
    { length: session.timelineMonths },
    (_, i) => i + 1,
  );

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 space-y-2"
      >
        <p className="text-indigo-400/70 text-xs tracking-[0.4em] uppercase font-semibold">
          Your Journey
        </p>
        <h1 className="text-3xl font-bold text-white/90">Session Timeline</h1>
        <p className="text-white/35 text-sm max-w-md mx-auto">
          Every check-in, coach response, and milestone — your full progress
          thread.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── Progress header card ── */}
        <ProgressHeader
          session={session}
          totalWeeks={totalWeeks}
          weeksRemaining={weeksRemaining}
          progressPercent={progressPercent}
        />

        {/* ── Month-by-month timeline ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-2"
        >
          {months.map((monthIndex, i) => (
            <motion.div
              key={monthIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <MonthBlock
                monthIndex={monthIndex}
                plan={session.plan?.months?.[monthIndex - 1]}
                checkins={checkinsByMonth[monthIndex] ?? []}
                totalMonths={session.timelineMonths}
                currentMonth={session.currentMonth}
              />
              {i < months.length - 1 && (
                <div className="ml-[14px] w-px h-3 bg-white/6" />
              )}
            </motion.div>
          ))}

          {/* ── End cap ── */}
          {session.status === "complete" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Goal achieved 🎉
                </p>
                <p className="text-xs text-white/35">
                  {totalWeeks} weeks · {progressPercent}% documented
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3 pt-2 opacity-30">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <Target size={14} className="text-white/50" />
              </div>
              <p className="text-xs text-white/40">Goal finish line</p>
            </div>
          )}
        </motion.div>

        {/* ── Empty state (session exists but no checkins yet) ── */}
        {checkins.length === 0 && session.status === "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-10 rounded-2xl border border-dashed border-white/10 space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <p className="text-white/50 text-sm font-medium">
              Your first check-in is coming up
            </p>
            <p className="text-white/30 text-xs max-w-xs mx-auto">
              Complete your weekly check-in on the dashboard to start building
              your progress thread.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
