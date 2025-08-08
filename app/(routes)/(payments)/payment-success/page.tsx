// app/payment-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId");

  useEffect(() => {
    if (txnId) {
      verifyPayment(txnId);
    }
  }, [txnId]);

  const verifyPayment = async (transactionId: string) => {
    try {
      const response = await fetch("/api/phonepe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      const result = await response.json();

      if (result.success && result.status === "SUCCESS") {
        setVerificationStatus("success");
        setTransactionDetails(result.data);
      } else {
        setVerificationStatus("failed");
      }
    } catch (error) {
      setVerificationStatus("failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {verificationStatus === "verifying" && "Verifying Payment..."}
            {verificationStatus === "success" && "Payment Successful! 🎉"}
            {verificationStatus === "failed" && "Payment Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {verificationStatus === "verifying" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-600" />
              <p className="text-gray-600">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <div className="space-y-2">
                <p className="text-green-600 font-medium">
                  Your subscription has been activated!
                </p>
                <p className="text-sm text-gray-600">Transaction ID: {txnId}</p>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full mt-4"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}

          {verificationStatus === "failed" && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-600" />
              <div className="space-y-2">
                <p className="text-red-600 font-medium">
                  Payment verification failed
                </p>
                <p className="text-sm text-gray-600">
                  Please contact support if amount was deducted
                </p>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/dashboard/billing")}
                  className="w-full mt-4"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
