// app/api/admin/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { paymentsTable, usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, action } = await request.json();
    const newStatus = action === "verify" ? "verified" : "rejected";

    // ✅ Update payment status
    const updatedPayment = await db
      .update(paymentsTable)
      .set({
        status: newStatus,
        verifiedAt: new Date(),
        verifiedBy: "admin",
        notes:
          action === "verify"
            ? "Payment verified by admin"
            : "Payment rejected by admin",
      })
      .where(eq(paymentsTable.paymentId, paymentId))
      .returning();

    if (action === "verify" && updatedPayment[0]) {
      const payment = updatedPayment[0];

      console.log(`🔍 Payment verification details:`, {
        paymentId: payment.paymentId,
        userEmail: payment.userEmail,
        planId: payment.planId,
        amount: payment.amount,
      });

      // ✅ Look up user by email (more reliable than phone)
      console.log(`📧 Looking up user with email: "${payment.userEmail}"`);

      const userToUpdate = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, payment.userEmail))
        .limit(1);

      console.log(
        `👥 Users found for email "${payment.userEmail}": ${userToUpdate.length}`
      );

      if (userToUpdate.length > 0) {
        const user = userToUpdate[0];
        console.log(`✅ Found user:`, {
          email: user.email,
          name: user.name,
          currentPlan: user.subscriptionPlan,
          currentStatus: user.subscriptionStatus,
        });

        // ✅ Update user subscription
        const updateUserData = {
          subscriptionStatus: "active",
          subscriptionPlan: payment.planId,
          updatedAt: new Date(),
          credits:
            payment.planId === "premium"
              ? -1
              : payment.planId === "basic"
              ? 25
              : 5,
          subscriptionExpiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
          // ✅ Also update phone in user record if needed
          phone: user.phone || payment.phone,
        };

        console.log(`🔄 Updating user subscription with:`, updateUserData);

        const updateResult = await db
          .update(usersTable)
          .set(updateUserData)
          .where(eq(usersTable.email, payment.userEmail))
          .returning();

        console.log(`✅ Subscription activated:`, {
          email: payment.userEmail,
          plan: payment.planId,
          credits: updateUserData.credits,
          status: updateUserData.subscriptionStatus,
        });
      } else {
        // ✅ If user not found by email, create user record
        console.log(`❌ No user found for email: "${payment.userEmail}"`);
        console.log(`🆕 Creating new user record...`);

        try {
          const newUser = await db
            .insert(usersTable)
            .values({
              name: payment.userEmail.split("@")[0], // Use email prefix as name
              email: payment.userEmail,
              phone: payment.phone,
              subscriptionStatus: "active",
              subscriptionPlan: payment.planId,
              credits:
                payment.planId === "premium"
                  ? -1
                  : payment.planId === "basic"
                  ? 25
                  : 5,
              subscriptionExpiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            })
            .returning();

          console.log(
            `✅ Created new user and activated subscription:`,
            newUser[0]
          );
        } catch (createError) {
          console.error(`💥 Failed to create user:`, createError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${
        action === "verify" ? "verified" : "rejected"
      } successfully`,
    });
  } catch (error) {
    console.error("💥 Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
