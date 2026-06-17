import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  coachingSessions: defineTable({
    userId: v.string(),

    // Intake answers
    currentSituation: v.string(),      // What they've achieved / where they are now
    goalDescription: v.string(),       // What they want to achieve
    timelineMonths: v.number(),        // How many months to reach the goal
    obstacles: v.optional(v.string()), // Known blockers or concerns

    // AI-generated plan (stored as JSON string, parsed on the client)
    plan: v.optional(v.string()),      // JSON: { months: [{ month, milestone, tasks, deadline }] }

    // Session state
    status: v.union(
      v.literal("generating"),   // plan is being generated
      v.literal("active"),       // plan exists, weekly checkins ongoing
      v.literal("complete"),     // user marked goal as done
      v.literal("abandoned"),    // user gave up / paused
    ),

    nextCheckinDate: v.optional(v.number()), // Unix timestamp — auto-bumped +7 days after each checkin
    currentMonth: v.optional(v.number()),    // Which month of the plan we're in (1-indexed)

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  weeklyCheckins: defineTable({
    sessionId: v.id("coachingSessions"),
    userId: v.string(),                // Denormalized for easy querying

    weekNumber: v.number(),            // 1, 2, 3... auto-incremented
    checkinDate: v.number(),           // When the user submitted this checkin

    // User's report
    completedTasks: v.string(),        // What they actually did this week
    struggles: v.string(),             // What didn't work or felt hard
    energyLevel: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
    ),
    wantsReframe: v.boolean(),         // Did they hit a wall and want a reframe?

    // AI response
    advice: v.optional(v.string()),    // Adaptive coaching advice (plain text or JSON)
    reframe: v.optional(v.string()),   // Alternative approach if wantsReframe=true

    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_session_week", ["sessionId", "weekNumber"]),
});