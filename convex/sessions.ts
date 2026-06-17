// convex/sessions.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: {
    userId: v.string(),
    currentSituation: v.string(),
    goalDescription: v.string(),
    timelineMonths: v.number(),
    obstacles: v.optional(v.string()),
    plan: v.string(), // JSON string from /api/coach
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // One active session per user — abandon any existing active ones first
    const existingSessions = await ctx.db
      .query("coachingSessions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .collect();

    for (const session of existingSessions) {
      await ctx.db.patch(session._id, {
        status: "abandoned",
        updatedAt: now,
      });
    }

    // Next checkin is 7 days from now
    const nextCheckinDate = now + 7 * 24 * 60 * 60 * 1000;

    const sessionId = await ctx.db.insert("coachingSessions", {
      userId: args.userId,
      currentSituation: args.currentSituation,
      goalDescription: args.goalDescription,
      timelineMonths: args.timelineMonths,
      obstacles: args.obstacles,
      plan: args.plan,
      status: "active",
      nextCheckinDate,
      currentMonth: 1,
      createdAt: now,
      updatedAt: now,
    });

    return { sessionId, nextCheckinDate };
  },
});

// convex/sessions.ts (continued)

export const saveCheckin = mutation({
  args: {
    sessionId: v.id("coachingSessions"),
    userId: v.string(),
    completedTasks: v.string(),
    struggles: v.string(),
    energyLevel: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    wantsReframe: v.boolean(),
    advice: v.string(),           // already fetched from /api/checkin before calling this
    reframe: v.optional(v.string()), // already fetched from /api/reframe if wantsReframe=true
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Verify session exists and belongs to this user
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== args.userId) {
      throw new Error("Session not found or access denied");
    }
    if (session.status !== "active") {
      throw new Error("Cannot check in on a session that is not active");
    }

    // Get current week number (count existing checkins + 1)
    const existingCheckins = await ctx.db
      .query("weeklyCheckins")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const weekNumber = existingCheckins.length + 1;

    // Determine if we've crossed into a new month of the plan
    // Each month = ~4.3 weeks; we floor to keep it clean
    const currentMonth = Math.min(
      Math.ceil(weekNumber / 4),
      session.timelineMonths
    );

    // Bump nextCheckinDate forward 7 days from the current due date
    // (not from now — prevents drift if they check in late)
    const nextCheckinDate =
      (session.nextCheckinDate ?? now) + 7 * 24 * 60 * 60 * 1000;

    // Insert the weekly checkin record
    const checkinId = await ctx.db.insert("weeklyCheckins", {
      sessionId: args.sessionId,
      userId: args.userId,
      weekNumber,
      checkinDate: now,
      completedTasks: args.completedTasks,
      struggles: args.struggles,
      energyLevel: args.energyLevel,
      wantsReframe: args.wantsReframe,
      advice: args.advice,
      reframe: args.reframe,
      createdAt: now,
    });

    // Update the session: bump dates, advance month, check for completion
    const isComplete = weekNumber >= session.timelineMonths * 4;

    await ctx.db.patch(args.sessionId, {
      nextCheckinDate,
      currentMonth,
      status: isComplete ? "complete" : "active",
      updatedAt: now,
    });

    return { checkinId, weekNumber, nextCheckinDate, isComplete };
  },
});

// convex/sessions.ts (continued)

export const getSessionHistory = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user's active (or most recently completed) session
    const session = await ctx.db
      .query("coachingSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    if (!session) return null;

    // Get all checkins for this session, ordered by week
    const checkins = await ctx.db
      .query("weeklyCheckins")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .order("asc")
      .collect();

    // Parse the plan JSON once here so components get a typed object
    let plan: MonthlyPlan | null = null;
    try {
      plan = session.plan ? JSON.parse(session.plan) : null;
    } catch {
      plan = null;
    }

    // Group checkins by month for the SessionHistory timeline view
    const checkinsByMonth = checkins.reduce<Record<number, typeof checkins>>(
      (acc, checkin) => {
        const month = Math.ceil(checkin.weekNumber / 4);
        if (!acc[month]) acc[month] = [];
        acc[month].push(checkin);
        return acc;
      },
      {}
    );

    return {
      session: {
        ...session,
        plan, // overwrite the raw string with the parsed object
      },
      checkins,           // flat list for DeadlineTracker / CoachAdvice
      checkinsByMonth,    // grouped for SessionHistory timeline
      totalWeeks: checkins.length,
      weeksRemaining: Math.max(0, session.timelineMonths * 4 - checkins.length),
      progressPercent: Math.round(
        (checkins.length / (session.timelineMonths * 4)) * 100
      ),
    };
  },
});

// Type for the parsed plan — mirror this in your API route return type
export type MonthlyPlan = {
  months: Array<{
    month: number;
    milestone: string;
    tasks: string[];
    deadline: string; // ISO date string e.g. "2026-07-15"
  }>;
};