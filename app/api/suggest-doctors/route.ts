import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "@/shared/list";
import { openai } from "@/config/OpenAiModel";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: `You are a helpful medical assistant. You will be given a list of doctors (in JSON format), and a user's symptom notes. Your task is to analyze the notes and return the most suitable doctors from the list — exactly as-is (same objects). Do NOT modify or invent any doctors.

Only return a valid JSON array (no markdown or explanation). Example format:
[
  {
    "id": 3,
    "specialist": "Dermatologist",
    "description": "...",
    ...
  },
  ...
]`,
        },
        {
          role: "user",
          content: `User notes: ${notes}

Here is the list of available doctors:
${JSON.stringify(AIDoctorAgents)}
`,
        },
      ],
    });

    const message = completion.choices[0].message;

    // Extract and clean the JSON
    const rawContent = message.content || "";
    const jsonString = rawContent.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonString);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("LLM Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
