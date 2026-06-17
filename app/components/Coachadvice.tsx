// components/CoachAdvice.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type EnergyLevel = "low" | "medium" | "high";

type Checkin = {
  _id: string;
  weekNumber: number;
  checkinDate: number;
  completedTasks: string;
  struggles: string;
  energyLevel: EnergyLevel;
  wantsReframe: boolean;
  advice?: string;   // JSON string: { assessment, advice, focusTask, encouragement }
  reframe?: string;  // JSON string: { diagnosis, reframe, newApproach, reducedTarget, warningSign }
};

type ParsedAdvice = {
  assessment: string;
  advice: string;
  focusTask: string;
  encouragement: string;
};

type ParsedReframe = {
  diagnosis: string;
  reframe: string;
  newApproach: string;
  reducedTarget: string;
  warningSign: string;
};

type Props = {
  checkins: Checkin[];
  goalDescription: string;
  currentMilestone: string;
  // Called when user requests a reframe on the latest checkin
  onReframeRequest?: (reframe: ParsedReframe) => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAdvice(raw?: string): ParsedAdvice | null {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function parseReframe(raw?: string): ParsedReframe | null {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
  });
}

const ENERGY_COLOR: Record<EnergyLevel, string> = {
  low:    "text-orange-500",
  medium: "text-yellow-500",
  high:   "text-emerald-500",
};

const ENERGY_DOT: Record<EnergyLevel, string> = {
  low:    "bg-orange-500",
  medium: "bg-yellow-400",
  high:   "bg-emerald-500",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReframePanel({ reframe }: { reframe: ParsedReframe }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-3 overflow-hidden"
    >
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-3">
        <p className="text-xs text-orange-500 uppercase tracking-wide font-semibold">Reframe</p>

        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">What&apos;s actually going on</p>
          <p className="text-sm text-foreground leading-relaxed">{reframe.diagnosis}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">A different lens</p>
          <p className="text-sm text-foreground leading-relaxed">{reframe.reframe}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">New approach for the next 2 weeks</p>
          <p className="text-sm text-foreground leading-relaxed">{reframe.newApproach}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Scaled target</p>
            <p className="text-xs text-foreground leading-relaxed">{reframe.reducedTarget}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">Watch for</p>
            <p className="text-xs text-foreground leading-relaxed">{reframe.warningSign}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckinCard({
  checkin,
  isLatest,
  goalDescription,
  currentMilestone,
  allCheckins,
}: {
  checkin: Checkin;
  isLatest: boolean;
  goalDescription: string;
  currentMilestone: string;
  allCheckins: Checkin[];
}) {
  const [expanded, setExpanded] = useState(isLatest);
  const [reframeState, setReframeState] = useState<
    "idle" | "loading" | "done"
  >(checkin.reframe ? "done" : "idle");
  const [reframe, setReframe] = useState<ParsedReframe | null>(
    parseReframe(checkin.reframe)
  );
  const [showReframe, setShowReframe] = useState(!!checkin.reframe);

  const advice = parseAdvice(checkin.advice);

  async function requestReframe() {
    setReframeState("loading");
    try {
      const history = allCheckins
        .filter((c) => c.weekNumber < checkin.weekNumber)
        .slice(-3);

      const res = await fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalDescription,
          currentMilestone,
          weekNumber: checkin.weekNumber,
          completedTasks: checkin.completedTasks,
          struggles: checkin.struggles,
          energyLevel: checkin.energyLevel,
          checkinHistory: history,
        }),
      });

      if (!res.ok) throw new Error("Reframe failed");
      const { reframe: parsed } = await res.json();
      setReframe(parsed);
      setReframeState("done");
      setShowReframe(true);
    } catch {
      setReframeState("idle");
    }
  }

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all ${
        isLatest
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Energy dot */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${ENERGY_DOT[checkin.energyLevel]}`}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                Week {checkin.weekNumber}
              </span>
              {isLatest && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                  Latest
                </span>
              )}
              {checkin.wantsReframe && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                  Reframe
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(checkin.checkinDate)} ·{" "}
              <span className={ENERGY_COLOR[checkin.energyLevel]}>
                {checkin.energyLevel} energy
              </span>
            </p>
          </div>
        </div>

        {/* Collapse icon */}
        <span
          className={`text-muted-foreground text-xs transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border/60 pt-4">

              {/* User report */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                    Completed
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {checkin.completedTasks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                    Struggled with
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {checkin.struggles}
                  </p>
                </div>
              </div>

              {/* Coach advice */}
              {advice ? (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Coach feedback
                  </p>

                  <p className="text-sm text-foreground leading-relaxed">
                    {advice.assessment}
                  </p>

                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      For next week
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {advice.advice}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                    <span className="text-primary text-xs font-bold mt-0.5 shrink-0">→</span>
                    <p className="text-sm font-medium text-foreground">
                      {advice.focusTask}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground italic">
                    {advice.encouragement}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No coach feedback recorded for this week.
                </p>
              )}

              {/* Reframe section */}
              {checkin.wantsReframe && (
                <div className="pt-1">
                  {reframeState === "idle" && (
                    <button
                      onClick={requestReframe}
                      className="text-sm text-orange-500 font-medium hover:underline"
                    >
                      Generate reframe →
                    </button>
                  )}

                  {reframeState === "loading" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                      Rethinking your approach…
                    </div>
                  )}

                  {reframeState === "done" && reframe && (
                    <>
                      <button
                        onClick={() => setShowReframe((v) => !v)}
                        className="text-sm text-orange-500 font-medium hover:underline"
                      >
                        {showReframe ? "Hide reframe" : "Show reframe"} →
                      </button>
                      <AnimatePresence>
                        {showReframe && <ReframePanel reframe={reframe} />}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CoachAdvice({
  checkins,
  goalDescription,
  currentMilestone,
}: Props) {
  const sorted = [...checkins].sort((a, b) => b.weekNumber - a.weekNumber);

  if (sorted.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No check-ins yet. Your coach feedback will appear here after your first weekly report.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <h2 className="text-xl font-semibold text-foreground mb-6">Coach Feedback</h2>

      {sorted.map((checkin, i) => (
        <CheckinCard
          key={checkin._id}
          checkin={checkin}
          isLatest={i === 0}
          goalDescription={goalDescription}
          currentMilestone={currentMilestone}
          allCheckins={checkins}
        />
      ))}
    </div>
  );
}