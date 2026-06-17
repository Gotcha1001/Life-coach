// app/api/reframe/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    goalDescription,
    currentMilestone,
    weekNumber,
    completedTasks,
    struggles,
    energyLevel,
    checkinHistory, // array of last 2-3 weeks to spot patterns
  } = await req.json();

  const recentHistory = checkinHistory?.length
    ? checkinHistory
        .slice(-3)
        .map(
          (c: { weekNumber: number; struggles: string; completedTasks: string }) =>
            `Week ${c.weekNumber}: completed "${c.completedTasks}", struggled with "${c.struggles}"`
        )
        .join("\n")
    : "No prior history available";

  const prompt = `You are a realistic, compassionate life coach. A client has hit a wall and is requesting a reframe of their approach.

THEIR GOAL:
${goalDescription}

CURRENT MILESTONE THEY'RE STUCK ON:
${currentMilestone}

THIS WEEK'S REPORT:
- What they completed: ${completedTasks}
- What they struggled with: ${struggles}
- Energy level: ${energyLevel}
- Week number: ${weekNumber}

RECENT PATTERN (last 3 weeks):
${recentHistory}

They need a honest reframe — not toxic positivity, not giving up. A realistic look at what's not working and a concrete alternative path forward.

Respond ONLY with a JSON object, no markdown, no backticks:
{
  "diagnosis": "2-3 sentences identifying the real underlying issue — what pattern is actually causing the struggle",
  "reframe": "2-3 sentences reframing the situation honestly — what this struggle is actually telling them",
  "newApproach": "A concrete alternative approach for the next 2 weeks — specific and different from what they've been doing",
  "reducedTarget": "A scaled-down version of their current milestone that is still meaningful but more achievable right now",
  "warningSign": "One specific thing to watch for that would signal this new approach also isn't working"
}

Rules:
- The diagnosis must name the real problem, not soften it
- The reframe must be honest — if the goal needs adjusting, say so
- The newApproach must be genuinely different from the implied current approach, not just "try harder"
- The reducedTarget is not giving up — frame it as strategic recalibration
- Never use phrases like "you've got this", "believe in yourself", or "stay positive"`;

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
  console.log("OpenRouter reframe response:", JSON.stringify(data, null, 2));

  const text = data.choices?.[0]?.message?.content || "";
  if (!text) {
    return NextResponse.json(
      { error: "No response", raw: data },
      { status: 500 }
    );
  }

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return NextResponse.json({ reframe: parsed });
}