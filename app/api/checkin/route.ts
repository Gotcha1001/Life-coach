// app/api/checkin/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    goalDescription,
    currentMonth,
    weekNumber,
    currentMilestone,
    currentTask,
    completedTasks,
    struggles,
    energyLevel,
  } = await req.json();

  const prompt = `You are a direct, practical life coach. A client is checking in on their goal progress.

THEIR GOAL:
${goalDescription}

WHERE THEY ARE:
- Month ${currentMonth} of their plan
- Week ${weekNumber} overall
- This month's milestone: ${currentMilestone}
- This week's target task: ${currentTask}

THIS WEEK'S REPORT:
- What they completed: ${completedTasks}
- What they struggled with: ${struggles}
- Energy level: ${energyLevel}

Respond ONLY with a JSON object, no markdown, no backticks:
{
  "assessment": "2-3 sentences honestly assessing their week — acknowledge wins, name struggles directly",
  "advice": "3-4 sentences of specific, actionable advice for next week based on what they reported",
  "focusTask": "One single most important task for them to do first next week",
  "encouragement": "1 sentence — genuine, not generic. Reference something specific from their report"
}

Rules:
- Be direct and honest, not cheerleader-ish
- If energy was low, acknowledge it and adapt the advice accordingly
- If they struggled, give a concrete strategy to address that specific struggle
- The focusTask must be specific and doable in one sitting`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  const data = await response.json();
  console.log("OpenRouter checkin response:", JSON.stringify(data, null, 2));

  const text = data.choices?.[0]?.message?.content || "";
  if (!text) {
    return NextResponse.json(
      { error: "No response", raw: data },
      { status: 500 }
    );
  }

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return NextResponse.json({ advice: parsed });
}