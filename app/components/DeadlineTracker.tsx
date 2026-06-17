// components/DeadlineTracker.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "upcoming" | "due-today" | "overdue" | "complete";

type Props = {
  nextCheckinDate?: number | null;  // Unix timestamp from session
  sessionStatus?: "generating" | "active" | "complete" | "abandoned";
  weekNumber?: number;              // Current week number (for label context)
  // Visual variant
  variant?: "badge" | "card";      // badge = compact inline, card = fuller panel
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(nextCheckinDate: number, now: number): Status {
  const diff = nextCheckinDate - now;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < -oneDay) return "overdue";
  if (diff < oneDay) return "due-today";
  return "upcoming";
}

function formatCheckinDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getDaysUntil(ts: number, now: number): number {
  return Math.ceil((ts - now) / (24 * 60 * 60 * 1000));
}

function getCountdownLabel(daysUntil: number, status: Status): string {
  if (status === "due-today") return "Due today";
  if (status === "overdue") {
    const days = Math.abs(daysUntil);
    return days === 1 ? "1 day overdue" : `${days} days overdue`;
  }
  if (daysUntil === 1) return "Tomorrow";
  return `In ${daysUntil} days`;
}

// ─── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status | "complete",
  {
    icon: React.ElementType;
    badgeClass: string;
    dotClass: string;
    labelColor: string;
    countdownColor: string;
  }
> = {
  upcoming: {
    icon: Calendar,
    badgeClass: "border-border bg-card",
    dotClass: "bg-primary animate-pulse",
    labelColor: "text-foreground",
    countdownColor: "text-muted-foreground",
  },
  "due-today": {
    icon: Clock,
    badgeClass: "border-primary/40 bg-primary/5",
    dotClass: "bg-primary animate-pulse",
    labelColor: "text-primary",
    countdownColor: "text-primary",
  },
  overdue: {
    icon: AlertTriangle,
    badgeClass: "border-destructive/40 bg-destructive/5",
    dotClass: "bg-destructive",
    labelColor: "text-destructive",
    countdownColor: "text-destructive",
  },
  complete: {
    icon: CheckCircle2,
    badgeClass: "border-emerald-500/30 bg-emerald-500/5",
    dotClass: "bg-emerald-500",
    labelColor: "text-emerald-600 dark:text-emerald-400",
    countdownColor: "text-emerald-600 dark:text-emerald-400",
  },
};

// ─── Badge variant (compact, for sidebar / header) ────────────────────────────

function BadgeVariant({
  status,
  label,
  countdown,
  config,
}: {
  status: Status | "complete";
  label: string;
  countdown: string;
  config: (typeof STATUS_CONFIG)[Status];
}) {
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${config.badgeClass}`}
    >
      {/* Pulse dot */}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />

      {/* Label */}
      <span className={`text-xs font-medium ${config.labelColor}`}>
        {label}
      </span>

      {/* Separator */}
      <span className="text-border text-xs">·</span>

      {/* Countdown */}
      <span className={`text-xs ${config.countdownColor}`}>
        {countdown}
      </span>
    </motion.div>
  );
}

// ─── Card variant (richer, for dashboard panel) ───────────────────────────────

function CardVariant({
  status,
  label,
  countdown,
  dateString,
  weekNumber,
  config,
}: {
  status: Status | "complete";
  label: string;
  countdown: string;
  dateString: string;
  weekNumber?: number;
  config: (typeof STATUS_CONFIG)[Status];
}) {
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border p-4 flex items-center gap-4 ${config.badgeClass}`}
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          status === "complete"
            ? "bg-emerald-500/10"
            : status === "overdue"
            ? "bg-destructive/10"
            : status === "due-today"
            ? "bg-primary/10"
            : "bg-muted"
        }`}
      >
        <Icon
          className={`w-4 h-4 ${
            status === "complete"
              ? "text-emerald-500"
              : status === "overdue"
              ? "text-destructive"
              : status === "due-today"
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.labelColor}`}>
          {label}
        </p>
        {dateString && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {dateString}
            {weekNumber != null ? ` · Week ${weekNumber}` : ""}
          </p>
        )}
      </div>

      {/* Countdown pill */}
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
          status === "complete"
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : status === "overdue"
            ? "bg-destructive/10 text-destructive"
            : status === "due-today"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {countdown}
      </span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DeadlineTracker({
  nextCheckinDate,
  sessionStatus,
  weekNumber,
  variant = "badge",
}: Props) {
  const now = Date.now();

  const { status, label, countdown, dateString, config } = useMemo(() => {
    // Session complete
    if (sessionStatus === "complete") {
      return {
        status: "complete" as const,
        label: "Goal complete",
        countdown: "🎉",
        dateString: "",
        config: STATUS_CONFIG.complete,
      };
    }

    // No date yet (plan still generating)
    if (!nextCheckinDate) {
      return {
        status: "upcoming" as const,
        label: "Check-in pending",
        countdown: "–",
        dateString: "",
        config: STATUS_CONFIG.upcoming,
      };
    }

    const s = getStatus(nextCheckinDate, now);
    const daysUntil = getDaysUntil(nextCheckinDate, now);
    const countdownLabel = getCountdownLabel(daysUntil, s);

    return {
      status: s,
      label: s === "overdue"
        ? "Check-in overdue"
        : s === "due-today"
        ? "Check in today"
        : `Next check-in: ${formatCheckinDate(nextCheckinDate)}`,
      countdown: countdownLabel,
      dateString: formatCheckinDate(nextCheckinDate),
      config: STATUS_CONFIG[s],
    };
  }, [nextCheckinDate, sessionStatus, now]);

  if (variant === "card") {
    return (
      <CardVariant
        status={status}
        label={label}
        countdown={countdown}
        dateString={dateString}
        weekNumber={weekNumber}
        config={config}
      />
    );
  }

  return (
    <BadgeVariant
      status={status}
      label={label}
      countdown={countdown}
      config={config}
    />
  );
}