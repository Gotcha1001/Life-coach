// app/api/coach/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { currentSituation, goalDescription, timelineMonths, obstacles } =
    await req.json();

  if (!currentSituation || !goalDescription || !timelineMonths) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = `You are a structured life coach. Generate a realistic month-by-month plan based on the following:

CURRENT SITUATION:
${currentSituation}

GOAL:
${goalDescription}

TIMELINE: ${timelineMonths} months
${obstacles ? `\nKNOWN OBSTACLES:\n${obstacles}` : ""}

Respond ONLY with a JSON object, no markdown, no backticks:
{
  "months": [
    {
      "month": 1,
      "milestone": "One clear, measurable milestone for this month",
      "tasks": [
        "Specific weekly task 1",
        "Specific weekly task 2",
        "Specific weekly task 3",
        "Specific weekly task 4"
      ],
      "deadline": "YYYY-MM-DD"
    }
  ]
}

Rules:
- Produce exactly ${timelineMonths} month objects
- Each milestone must be concrete and measurable, not vague
- Each tasks array must have exactly 4 items — one per week of the month
- Deadlines should be realistic, starting from today (${new Date().toISOString().split("T")[0]})
- Tasks should build progressively — early months are foundation, later months are execution
- Account for the known obstacles where relevant`;

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
  console.log("OpenRouter response:", JSON.stringify(data, null, 2));

  const text = data.choices?.[0]?.message?.content || "";
  if (!text) {
    return NextResponse.json(
      { error: "No response", raw: data },
      { status: 500 }
    );
  }

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (!parsed.months || !Array.isArray(parsed.months)) {
    return NextResponse.json(
      { error: "Invalid plan structure", raw: text },
      { status: 500 }
    );
  }

  return NextResponse.json({ plan: parsed });
}