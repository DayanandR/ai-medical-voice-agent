// app/(routes)/admin/payments/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner"; // ✅ Added toast import

// ✅ Fixed interface to match your paymentsTable schema
interface Payment {
  id: number;
  paymentId: string;
  planId: string;
  planName: string;
  amount: number;
  phone: string;
  status: string;
  createdAt: string;
  paymentProofPath: string;
  userEmail: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Added router for navigation

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // ✅ Toast error instead of console only
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (
    paymentId: string,
    action: "verify" | "reject"
  ) => {
    // ✅ Show loading toast
    const loadingToast = toast.loading(
      action === "verify" ? "Verifying payment..." : "Rejecting payment..."
    );

    try {
      const response = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action }),
      });

      if (response.ok) {
        // ✅ Dismiss loading and show success toast
        toast.dismiss(loadingToast);
        toast.success(
          `Payment ${
            action === "verify" ? "verified" : "rejected"
          } successfully!`,
          {
            description: `Payment ID: ${paymentId.slice(0, 12)}...`,
            duration: 3000,
          }
        );

        fetchPayments(); // Refresh list
      } else {
        throw new Error(`Failed to ${action} payment`);
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      // ✅ Dismiss loading and show error toast
      toast.dismiss(loadingToast);
      toast.error(`Failed to ${action} payment. Please try again.`, {
        description: "Check your connection and try again",
        duration: 4000,
      });
    }
  };

  // ✅ Added navigation function
  const navigateToDashboard = () => {
    toast.info("Redirecting to dashboard...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ✅ Added header with navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Verification
          </h1>
          <p className="text-gray-600 mt-1">
            AI Medical Voice Agent - Admin Panel
          </p>
        </div>

        {/* ✅ Dashboard navigation button */}
        <Button
          onClick={navigateToDashboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6">
        {payments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending payments found
              </h3>
              <p className="text-gray-500 mb-4">
                All payments have been processed or no new payments received
              </p>
              <Button onClick={navigateToDashboard} variant="outline">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ✅ Added summary card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">
                      Pending Payments: {payments.length}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Total amount: ₹
                      {payments.reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Requires Action
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment cards */}
            {payments.map((payment) => (
              <Card
                key={payment.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    {/* Payment Info */}
                    <div>
                      <h3 className="font-semibold text-lg text-green-600">
                        ₹{payment.amount}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {payment.planName} Plan
                      </p>
                      <p className="text-sm text-gray-500">{payment.phone}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        User Email
                      </p>
                      <p className="text-sm text-blue-600 break-all">
                        {payment.userEmail}
                      </p>
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Payment ID
                      </p>
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {payment.paymentId?.slice(0, 12)}...
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge
                        variant={
                          payment.status === "pending"
                            ? "outline"
                            : payment.status === "verified"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          payment.status === "pending"
                            ? "border-orange-300 text-orange-700 bg-orange-50"
                            : ""
                        }
                      >
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Screenshot */}
                    <div>
                      {payment.paymentProofPath ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(payment.paymentProofPath, "_blank")
                          }
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Screenshot
                        </Button>
                      ) : (
                        <p className="text-xs text-gray-400">No screenshot</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          handleVerifyPayment(payment.paymentId, "verify")
                        }
                        disabled={payment.status !== "pending"}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleVerifyPayment(payment.paymentId, "reject")
                        }
                        disabled={payment.status !== "pending"}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
