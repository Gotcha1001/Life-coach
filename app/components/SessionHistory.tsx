// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Zap,
//   Battery,
//   BatteryLow,
//   RotateCcw,
//   CheckCircle2,
//   Circle,
//   Target,
//   TrendingUp,
//   Calendar,
//   MessageSquare,
//   AlertTriangle,
// } from "lucide-react";

// // ─── Types (mirror convex/sessions.ts) ─────────────────────────────────────

// type EnergyLevel = "low" | "medium" | "high";

// type WeeklyCheckin = {
//   _id: string;
//   weekNumber: number;
//   checkinDate: number;
//   completedTasks: string;
//   struggles: string;
//   energyLevel: EnergyLevel;
//   wantsReframe: boolean;
//   advice?: string;
//   reframe?: string;
// };

// type MonthPlan = {
//   month: number;
//   milestone: string;
//   tasks: string[];
//   deadline: string;
// };

// type MonthlyPlan = {
//   months: MonthPlan[];
// };

// type SessionHistoryProps = {
//   session: {
//     goalDescription: string;
//     timelineMonths: number;
//     status: "generating" | "active" | "complete" | "abandoned";
//     currentMonth?: number;
//     plan: MonthlyPlan | null;
//     createdAt: number;
//   };
//   checkins: WeeklyCheckin[];
//   checkinsByMonth: Record<number, WeeklyCheckin[]>;
//   totalWeeks: number;
//   weeksRemaining: number;
//   progressPercent: number;
// };

// // ─── Sub-components ─────────────────────────────────────────────────────────

// function EnergyBadge({ level }: { level: EnergyLevel }) {
//   const config = {
//     low: {
//       icon: BatteryLow,
//       label: "Low energy",
//       className: "bg-red-500/10 text-red-400 border-red-500/20",
//     },
//     medium: {
//       icon: Battery,
//       label: "Medium energy",
//       className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
//     },
//     high: {
//       icon: Zap,
//       label: "High energy",
//       className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
//     },
//   }[level];

//   const Icon = config.icon;

//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium ${config.className}`}
//     >
//       <Icon size={11} />
//       {config.label}
//     </span>
//   );
// }

// function WeekCard({
//   checkin,
//   isLast,
// }: {
//   checkin: WeeklyCheckin;
//   isLast: boolean;
// }) {
//   const [expanded, setExpanded] = useState(false);

//   const date = new Intl.DateTimeFormat("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(checkin.checkinDate));

//   // Parse advice if it's JSON, otherwise treat as plain text
//   let parsedAdvice: {
//     assessment?: string;
//     advice?: string;
//     focusTask?: string;
//     encouragement?: string;
//   } | null = null;
//   if (checkin.advice) {
//     try {
//       parsedAdvice = JSON.parse(checkin.advice);
//     } catch {
//       parsedAdvice = { advice: checkin.advice };
//     }
//   }

//   return (
//     <div className="relative flex gap-4">
//       {/* Timeline spine */}
//       <div className="flex flex-col items-center flex-shrink-0 w-8">
//         <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center z-10">
//           <CheckCircle2 size={15} className="text-indigo-400" />
//         </div>
//         {!isLast && (
//           <div className="w-px flex-1 bg-gradient-to-b from-indigo-500/30 to-transparent mt-1" />
//         )}
//       </div>

//       {/* Card */}
//       <div className="flex-1 pb-8">
//         <motion.div
//           layout
//           className="rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden"
//         >
//           {/* Header — always visible */}
//           <button
//             onClick={() => setExpanded((v) => !v)}
//             className="w-full flex items-start justify-between p-4 text-left hover:bg-white/4 transition-colors"
//           >
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
//                   Week {checkin.weekNumber}
//                 </span>
//                 <EnergyBadge level={checkin.energyLevel} />
//                 {checkin.wantsReframe && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border bg-violet-500/10 text-violet-400 border-violet-500/20 font-medium">
//                     <RotateCcw size={10} />
//                     Reframed
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs text-white/40 flex items-center gap-1">
//                 <Calendar size={11} />
//                 {date}
//               </p>
//             </div>
//             <div className="text-white/30 mt-0.5 flex-shrink-0">
//               {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </div>
//           </button>

//           {/* Collapsed preview */}
//           {!expanded && (
//             <div className="px-4 pb-4">
//               <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
//                 {checkin.completedTasks}
//               </p>
//             </div>
//           )}

//           {/* Expanded detail */}
//           <AnimatePresence initial={false}>
//             {expanded && (
//               <motion.div
//                 key="detail"
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.22, ease: "easeInOut" }}
//                 className="overflow-hidden"
//               >
//                 <div className="px-4 pb-5 space-y-4 border-t border-white/6 pt-4">
//                   {/* What they did */}
//                   <div className="space-y-1.5">
//                     <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
//                       <CheckCircle2 size={11} />
//                       Completed
//                     </p>
//                     <p className="text-sm text-white/80 leading-relaxed">
//                       {checkin.completedTasks}
//                     </p>
//                   </div>

//                   {/* Struggles */}
//                   <div className="space-y-1.5">
//                     <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
//                       <AlertTriangle size={11} />
//                       Struggles
//                     </p>
//                     <p className="text-sm text-white/70 leading-relaxed">
//                       {checkin.struggles}
//                     </p>
//                   </div>

//                   {/* Coach advice */}
//                   {parsedAdvice && (
//                     <div className="rounded-lg bg-indigo-500/8 border border-indigo-500/20 p-3.5 space-y-3">
//                       <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
//                         <MessageSquare size={11} />
//                         Coach Response
//                       </p>
//                       {parsedAdvice.assessment && (
//                         <p className="text-sm text-white/70 leading-relaxed">
//                           {parsedAdvice.assessment}
//                         </p>
//                       )}
//                       {parsedAdvice.advice && (
//                         <p className="text-sm text-white/80 leading-relaxed font-medium">
//                           {parsedAdvice.advice}
//                         </p>
//                       )}
//                       {parsedAdvice.focusTask && (
//                         <div className="flex items-start gap-2 pt-1">
//                           <Target
//                             size={13}
//                             className="text-indigo-400 mt-0.5 flex-shrink-0"
//                           />
//                           <p className="text-sm text-indigo-300">
//                             <span className="font-semibold">Focus: </span>
//                             {parsedAdvice.focusTask}
//                           </p>
//                         </div>
//                       )}
//                       {parsedAdvice.encouragement && (
//                         <p className="text-xs text-white/50 italic leading-relaxed border-t border-indigo-500/20 pt-2.5">
//                           {parsedAdvice.encouragement}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {/* Reframe */}
//                   {checkin.reframe && (
//                     <div className="rounded-lg bg-violet-500/8 border border-violet-500/20 p-3.5 space-y-2">
//                       <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
//                         <RotateCcw size={11} />
//                         Alternative Approach
//                       </p>
//                       <p className="text-sm text-white/75 leading-relaxed">
//                         {checkin.reframe}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function MonthBlock({
//   monthIndex,
//   plan,
//   checkins,
//   totalMonths,
//   currentMonth,
// }: {
//   monthIndex: number;
//   plan: MonthPlan | undefined;
//   checkins: WeeklyCheckin[];
//   totalMonths: number;
//   currentMonth: number | undefined;
// }) {
//   const [planOpen, setPlanOpen] = useState(false);
//   const isPast = currentMonth !== undefined && monthIndex < currentMonth;
//   const isCurrent = monthIndex === currentMonth;
//   const isFuture = currentMonth !== undefined && monthIndex > currentMonth;

//   return (
//     <div className="relative">
//       {/* Month header */}
//       <div className="flex items-center gap-3 mb-5">
//         <div
//           className={`
//             flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border text-sm font-bold
//             ${
//               isPast
//                 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
//                 : isCurrent
//                   ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
//                   : "bg-white/5 border-white/10 text-white/30"
//             }
//           `}
//         >
//           {monthIndex}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 flex-wrap">
//             <h3
//               className={`text-sm font-semibold ${
//                 isFuture ? "text-white/30" : "text-white/90"
//               }`}
//             >
//               Month {monthIndex}
//             </h3>
//             {isPast && (
//               <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
//                 Complete
//               </span>
//             )}
//             {isCurrent && (
//               <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
//                 In progress
//               </span>
//             )}
//             {isFuture && (
//               <span className="text-xs text-white/25 bg-white/4 px-2 py-0.5 rounded-full border border-white/8">
//                 Upcoming
//               </span>
//             )}
//           </div>
//           {plan?.milestone && (
//             <p
//               className={`text-xs mt-0.5 truncate ${
//                 isFuture ? "text-white/25" : "text-white/50"
//               }`}
//             >
//               {plan.milestone}
//             </p>
//           )}
//         </div>

//         {/* Plan toggle — only if a plan exists for this month */}
//         {plan && !isFuture && (
//           <button
//             onClick={() => setPlanOpen((v) => !v)}
//             className="text-xs text-white/35 hover:text-white/60 transition-colors flex items-center gap-1 flex-shrink-0"
//           >
//             Plan
//             {planOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//           </button>
//         )}
//       </div>

//       {/* Plan tasks accordion */}
//       <AnimatePresence initial={false}>
//         {planOpen && plan && (
//           <motion.div
//             key="plan"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2 }}
//             className="overflow-hidden mb-4"
//           >
//             <div className="ml-[52px] rounded-lg bg-white/4 border border-white/8 p-3.5 mb-4 space-y-2">
//               {plan.tasks.map((task, i) => (
//                 <div key={i} className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 mt-1.5 flex-shrink-0" />
//                   <p className="text-xs text-white/65 leading-relaxed">
//                     {task}
//                   </p>
//                 </div>
//               ))}
//               {plan.deadline && (
//                 <p className="text-xs text-amber-400/70 pt-1 border-t border-white/6 flex items-center gap-1.5">
//                   <Calendar size={10} />
//                   Deadline: {plan.deadline}
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Week cards for this month */}
//       <div className="ml-[52px]">
//         {checkins.length > 0 ? (
//           <div>
//             {checkins.map((checkin, i) => (
//               <WeekCard
//                 key={checkin._id}
//                 checkin={checkin}
//                 isLast={i === checkins.length - 1}
//               />
//             ))}
//           </div>
//         ) : (
//           !isFuture && (
//             <div className="flex items-center gap-2 text-white/25 text-sm pb-6">
//               <Circle size={14} />
//               No check-ins yet for this month
//             </div>
//           )
//         )}

//         {isFuture && (
//           <div className="border border-dashed border-white/8 rounded-xl p-4 mb-8 flex items-center gap-3">
//             <div className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0">
//               <Circle size={11} className="text-white/20" />
//             </div>
//             <p className="text-xs text-white/25">
//               {plan?.tasks?.length
//                 ? `${plan.tasks.length} task${plan.tasks.length !== 1 ? "s" : ""} planned`
//                 : "Awaiting check-ins"}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Main component ──────────────────────────────────────────────────────────

// export default function SessionHistory({
//   session,
//   checkins,
//   checkinsByMonth,
//   totalWeeks,
//   weeksRemaining,
//   progressPercent,
// }: SessionHistoryProps) {
//   const months = Array.from(
//     { length: session.timelineMonths },
//     (_, i) => i + 1,
//   );

//   const startDate = new Intl.DateTimeFormat("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(session.createdAt));

//   const statusConfig = {
//     generating: { label: "Generating plan…", color: "text-amber-400" },
//     active: { label: "Active", color: "text-indigo-400" },
//     complete: { label: "Complete", color: "text-emerald-400" },
//     abandoned: { label: "Paused", color: "text-white/40" },
//   }[session.status];

//   return (
//     <div className="w-full max-w-2xl mx-auto space-y-8">
//       {/* ── Goal header ── */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-6 space-y-4"
//       >
//         <div className="flex items-start justify-between gap-4">
//           <div className="space-y-1 flex-1 min-w-0">
//             <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
//               Goal
//             </p>
//             <p className="text-base text-white/90 font-medium leading-snug">
//               {session.goalDescription}
//             </p>
//             <p className="text-xs text-white/35 flex items-center gap-1.5 pt-0.5">
//               <Calendar size={11} />
//               Started {startDate} · {session.timelineMonths}-month journey
//             </p>
//           </div>
//           <span
//             className={`text-xs font-semibold flex-shrink-0 ${statusConfig.color}`}
//           >
//             {statusConfig.label}
//           </span>
//         </div>

//         {/* Progress bar */}
//         <div className="space-y-1.5">
//           <div className="flex justify-between text-xs text-white/35">
//             <span className="flex items-center gap-1.5">
//               <TrendingUp size={11} />
//               {totalWeeks} week{totalWeeks !== 1 ? "s" : ""} logged
//             </span>
//             <span>{progressPercent}% complete</span>
//           </div>
//           <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${progressPercent}%` }}
//               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//               className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
//             />
//           </div>
//           <p className="text-xs text-white/30 text-right">
//             {weeksRemaining} week{weeksRemaining !== 1 ? "s" : ""} remaining
//           </p>
//         </div>
//       </motion.div>

//       {/* ── Timeline ── */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.15 }}
//         className="space-y-2"
//       >
//         {months.map((monthIndex, i) => (
//           <motion.div
//             key={monthIndex}
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 + i * 0.04 }}
//           >
//             <MonthBlock
//               monthIndex={monthIndex}
//               plan={session.plan?.months?.[monthIndex - 1]}
//               checkins={checkinsByMonth[monthIndex] ?? []}
//               totalMonths={session.timelineMonths}
//               currentMonth={session.currentMonth}
//             />
//             {i < months.length - 1 && (
//               <div className="ml-[20px] w-px h-4 bg-white/8" />
//             )}
//           </motion.div>
//         ))}

//         {/* End cap */}
//         {session.status === "complete" ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="flex items-center gap-3 ml-[0px] pt-2"
//           >
//             <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
//               <CheckCircle2 size={16} className="text-emerald-400" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-emerald-400">
//                 Goal achieved
//               </p>
//               <p className="text-xs text-white/35">
//                 {totalWeeks} weeks · {progressPercent}% documented
//               </p>
//             </div>
//           </motion.div>
//         ) : (
//           <div className="flex items-center gap-3 pt-2 opacity-30">
//             <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
//               <Target size={14} className="text-white/50" />
//             </div>
//             <p className="text-xs text-white/40">Goal finish line</p>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Battery,
  BatteryLow,
  RotateCcw,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
// ─── Types (mirror convex/sessions.ts) ─────────────────────────────────────
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
type SessionHistoryProps = {
  session: {
    goalDescription: string;
    timelineMonths: number;
    status: "generating" | "active" | "complete" | "abandoned";
    currentMonth?: number;
    plan: MonthlyPlan | null;
    createdAt: number;
  };
  checkins: WeeklyCheckin[];
  checkinsByMonth: Record<number, WeeklyCheckin[]>;
  totalWeeks: number;
  weeksRemaining: number;
  progressPercent: number;
};
// ─── Sub-components ─────────────────────────────────────────────────────────
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
  // Parse advice if it's JSON, otherwise treat as plain text
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
          className="rounded-xl border border-foreground/8 bg-foreground/4 backdrop-blur-sm overflow-hidden"
        >
          {/* Header — always visible */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-start justify-between p-4 text-left hover:bg-foreground/4 transition-colors"
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
              <p className="text-xs text-foreground/40 flex items-center gap-1">
                <Calendar size={11} />
                {date}
              </p>
            </div>
            <div className="text-foreground/30 mt-0.5 flex-shrink-0">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>
          {/* Collapsed preview */}
          {!expanded && (
            <div className="px-4 pb-4">
              <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">
                {checkin.completedTasks}
              </p>
            </div>
          )}
          {/* Expanded detail */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-5 space-y-4 border-t border-foreground/6 pt-4">
                  {/* What they did */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={11} />
                      Completed
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {checkin.completedTasks}
                    </p>
                  </div>
                  {/* Struggles */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={11} />
                      Struggles
                    </p>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {checkin.struggles}
                    </p>
                  </div>
                  {/* Coach advice */}
                  {parsedAdvice && (
                    <div className="rounded-lg bg-indigo-500/8 border border-indigo-500/20 p-3.5 space-y-3">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={11} />
                        Coach Response
                      </p>
                      {parsedAdvice.assessment && (
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {parsedAdvice.assessment}
                        </p>
                      )}
                      {parsedAdvice.advice && (
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                          {parsedAdvice.advice}
                        </p>
                      )}
                      {parsedAdvice.focusTask && (
                        <div className="flex items-start gap-2 pt-1">
                          <Target
                            size={13}
                            className="text-indigo-400 mt-0.5 flex-shrink-0"
                          />
                          <p className="text-sm text-indigo-300">
                            <span className="font-semibold">Focus: </span>
                            {parsedAdvice.focusTask}
                          </p>
                        </div>
                      )}
                      {parsedAdvice.encouragement && (
                        <p className="text-xs text-foreground/50 italic leading-relaxed border-t border-indigo-500/20 pt-2.5">
                          {parsedAdvice.encouragement}
                        </p>
                      )}
                    </div>
                  )}
                  {/* Reframe */}
                  {checkin.reframe && (
                    <div className="rounded-lg bg-violet-500/8 border border-violet-500/20 p-3.5 space-y-2">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                        <RotateCcw size={11} />
                        Alternative Approach
                      </p>
                      <p className="text-sm text-foreground/75 leading-relaxed">
                        {checkin.reframe}
                      </p>
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
  plan: MonthPlan | undefined;
  checkins: WeeklyCheckin[];
  totalMonths: number;
  currentMonth: number | undefined;
}) {
  const [planOpen, setPlanOpen] = useState(false);
  const isPast = currentMonth !== undefined && monthIndex < currentMonth;
  const isCurrent = monthIndex === currentMonth;
  const isFuture = currentMonth !== undefined && monthIndex > currentMonth;
  return (
    <div className="relative">
      {/* Month header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border text-sm font-bold
            ${
              isPast
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : isCurrent
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-foreground/5 border-foreground/10 text-foreground/30"
            }
          `}
        >
          {monthIndex}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-sm font-semibold ${
                isFuture ? "text-foreground/30" : "text-foreground/90"
              }`}
            >
              Month {monthIndex}
            </h3>
            {isPast && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Complete
              </span>
            )}
            {isCurrent && (
              <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                In progress
              </span>
            )}
            {isFuture && (
              <span className="text-xs text-foreground/25 bg-foreground/4 px-2 py-0.5 rounded-full border border-foreground/8">
                Upcoming
              </span>
            )}
          </div>
          {plan?.milestone && (
            <p
              className={`text-xs mt-0.5 truncate ${
                isFuture ? "text-foreground/25" : "text-foreground/50"
              }`}
            >
              {plan.milestone}
            </p>
          )}
        </div>
        {/* Plan toggle — only if a plan exists for this month */}
        {plan && !isFuture && (
          <button
            onClick={() => setPlanOpen((v) => !v)}
            className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            Plan
            {planOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>
      {/* Plan tasks accordion */}
      <AnimatePresence initial={false}>
        {planOpen && plan && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="ml-[52px] rounded-lg bg-foreground/4 border border-foreground/8 p-3.5 mb-4 space-y-2">
              {plan.tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-foreground/65 leading-relaxed">
                    {task}
                  </p>
                </div>
              ))}
              {plan.deadline && (
                <p className="text-xs text-amber-400/70 pt-1 border-t border-foreground/6 flex items-center gap-1.5">
                  <Calendar size={10} />
                  Deadline: {plan.deadline}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Week cards for this month */}
      <div className="ml-[52px]">
        {checkins.length > 0 ? (
          <div>
            {checkins.map((checkin, i) => (
              <WeekCard
                key={checkin._id}
                checkin={checkin}
                isLast={i === checkins.length - 1}
              />
            ))}
          </div>
        ) : (
          !isFuture && (
            <div className="flex items-center gap-2 text-foreground/25 text-sm pb-6">
              <Circle size={14} />
              No check-ins yet for this month
            </div>
          )
        )}
        {isFuture && (
          <div className="border border-dashed border-foreground/8 rounded-xl p-4 mb-8 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-foreground/15 flex items-center justify-center flex-shrink-0">
              <Circle size={11} className="text-foreground/20" />
            </div>
            <p className="text-xs text-foreground/25">
              {plan?.tasks?.length
                ? `${plan.tasks.length} task${plan.tasks.length !== 1 ? "s" : ""} planned`
                : "Awaiting check-ins"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Main component ──────────────────────────────────────────────────────────
export default function SessionHistory({
  session,
  checkins,
  checkinsByMonth,
  totalWeeks,
  weeksRemaining,
  progressPercent,
}: SessionHistoryProps) {
  const months = Array.from(
    { length: session.timelineMonths },
    (_, i) => i + 1,
  );
  const startDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(session.createdAt));
  const statusConfig = {
    generating: { label: "Generating plan…", color: "text-amber-400" },
    active: { label: "Active", color: "text-indigo-400" },
    complete: { label: "Complete", color: "text-emerald-400" },
    abandoned: { label: "Paused", color: "text-foreground/40" },
  }[session.status];
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* ── Goal header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-foreground/10 bg-foreground/4 backdrop-blur-sm p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
              Goal
            </p>
            <p className="text-base text-foreground/90 font-medium leading-snug">
              {session.goalDescription}
            </p>
            <p className="text-xs text-foreground/35 flex items-center gap-1.5 pt-0.5">
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
          <div className="flex justify-between text-xs text-foreground/35">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={11} />
              {totalWeeks} week{totalWeeks !== 1 ? "s" : ""} logged
            </span>
            <span>{progressPercent}% complete</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-foreground/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            />
          </div>
          <p className="text-xs text-foreground/30 text-right">
            {weeksRemaining} week{weeksRemaining !== 1 ? "s" : ""} remaining
          </p>
        </div>
      </motion.div>
      {/* ── Timeline ── */}
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
              <div className="ml-[20px] w-px h-4 bg-foreground/8" />
            )}
          </motion.div>
        ))}
        {/* End cap */}
        {session.status === "complete" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 ml-[0px] pt-2"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Goal achieved
              </p>
              <p className="text-xs text-foreground/35">
                {totalWeeks} weeks · {progressPercent}% documented
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3 pt-2 opacity-30">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center">
              <Target size={14} className="text-foreground/50" />
            </div>
            <p className="text-xs text-foreground/40">Goal finish line</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
