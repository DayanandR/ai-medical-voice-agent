// app/api/submit-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { paymentsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser(); // ✅ Get current user for email
    const formData = await request.formData();

    const planId = formData.get("planId") as string;
    const phone = formData.get("phone") as string;
    const paymentProof = formData.get("paymentProof") as File;

    if (
      !planId ||
      !phone ||
      !paymentProof ||
      !user?.primaryEmailAddress?.emailAddress
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save payment proof file
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `payment-${Date.now()}-${paymentProof.name}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await paymentProof.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // ✅ Database insertion with user email
    const paymentRecord = await db
      .insert(paymentsTable)
      .values({
        paymentId: `PAY_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        planId,
        planName: planId.charAt(0).toUpperCase() + planId.slice(1),
        amount: planId === "basic" ? 299 : planId === "premium" ? 599 : 0,
        phone: phone,
        userEmail: user.primaryEmailAddress.emailAddress, // ✅ Include user email
        status: "pending",
        paymentProofPath: `/uploads/payments/${fileName}`,
        transactionNote: `AIMedical-${planId}-${Date.now()}`,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Payment submission received for verification",
      paymentId: paymentRecord[0].paymentId,
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit payment" },
      { status: 500 }
    );
  }
}
