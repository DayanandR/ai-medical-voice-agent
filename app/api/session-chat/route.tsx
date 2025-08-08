import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();

  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(sessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date(), // ✅ Fixed: Pass Date object
      })
      .returning(); // ✅ Fixed: Correct returning syntax

    return NextResponse.json(result[0]); // ✅ Return first result directly
  } catch (error) {
    console.error("Database insert error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  try {
    if (sessionId === "all") {
      const result = await db
        .select()
        .from(sessionChatTable)
        .where(
          eq(
            sessionChatTable.createdBy,
            user?.primaryEmailAddress?.emailAddress ?? ""
          )
        )
        .orderBy(desc(sessionChatTable.id));
      return NextResponse.json(result);
    } else {
      const result = await db
        .select()
        .from(sessionChatTable)
        .where(eq(sessionChatTable.sessionId, sessionId ?? ""));
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
