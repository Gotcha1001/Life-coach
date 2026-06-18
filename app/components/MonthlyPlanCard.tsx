// components/MonthlyPlanCard.tsx

"use client";

import { motion } from "framer-motion";
import { MonthlyPlan } from "@/convex/sessions";

type Props = {
  plan: MonthlyPlan;
  currentMonth: number; // from session — highlights the active month
};

export default function MonthlyPlanCard({ plan, currentMonth }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Your Plan</h2>

      {plan.months.map((month, index) => {
        const isPast = month.month < currentMonth;
        const isActive = month.month === currentMonth;
        const isFuture = month.month > currentMonth;

        return (
          <motion.div
            key={month.month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className={`rounded-2xl border p-5 transition-all ${
              isActive
                ? "border-primary text-white bg-radial from-purple-500 to-indigo-900 shadow-sm"
                : isPast
                  ? "border-border bg-muted/40 opacity-60"
                  : "border-border bg-card"
            }`}
          >
            {/* Month header */}
            <div className="flex items-center justify-between mb-3 ">
              <div className="flex items-center gap-3">
                {/* Status indicator */}
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isPast
                      ? "bg-muted-foreground"
                      : isActive
                        ? "bg-primary animate-pulse"
                        : "bg-border"
                  }`}
                />
                <span
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    isActive
                      ? "text-white"
                      : isPast
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }`}
                >
                  Month {month.month}
                </span>

                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                    Current
                  </span>
                )}

                {isPast && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    Complete
                  </span>
                )}
              </div>

              {/* Deadline */}
              <span className="text-xs text-muted-foreground">
                Due {formatDeadline(month.deadline)}
              </span>
            </div>

            {/* Milestone */}
            <p
              className={`text-sm font-medium mb-4 ${
                isFuture ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {month.milestone}
            </p>

            {/* Weekly tasks — only expanded for active and future months */}
            {!isPast && (
              <div className="space-y-2 ">
                {month.tasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-xs font-mono text-white w-12 shrink-0">
                      Week {i + 1}
                    </span>
                    <span className="text-white">{task}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Past month — collapsed, just show the milestone was hit */}
            {isPast && (
              <p className="text-xs text-muted-foreground italic">
                Milestone reached — see checkin history for details
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function formatDeadline(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
