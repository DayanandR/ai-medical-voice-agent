// app/api/admin/payments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { paymentsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const payments = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.status, "pending"))
      .orderBy(paymentsTable.createdAt);

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
