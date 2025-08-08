"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Upload, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriptionPlan {
  id: "free" | "basic" | "premium";
  name: string;
  price: number;
  features: string[];
  credits: number;
  popular: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "5 AI medical consultations",
      "Basic health advice",
      "Symptom checker access",
    ],
    credits: 5,
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: 299,
    features: [
      "25 AI medical consultations",
      "Detailed health reports",
      "Priority support",
      "Medical history tracking",
    ],
    credits: 25,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 599,
    features: [
      "Unlimited AI consultations",
      "Expert medical reviews",
      "24/7 priority support",
      "Advanced health analytics",
      "Specialist referrals",
    ],
    credits: -1,
    popular: false,
  },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [phone, setPhone] = useState<string>("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  // Your actual UPI ID
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID;

  // Generate UPI payment link
  const generateUPILink = (plan: SubscriptionPlan): string => {
    const transactionNote = `AIMedicalAgent-${plan.id}-${Date.now()}`;
    const merchantName = "AI Medical Voice Agent";

    return `upi://pay?pa=${UPI_ID}&pn=${merchantName}&am=${plan.price}&cu=INR&tn=${transactionNote}`;
  };

  const handlePlanSelect = (plan: SubscriptionPlan): void => {
    if (plan.price === 0) {
      toast.success("Free plan activated successfully!");
      return;
    }
    setSelectedPlan(plan);
  };

  // Update this function in your BillingPage component
  const handleSubmitPayment = async (): Promise<void> => {
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!paymentProof) {
      toast.error("Please upload payment screenshot");
      return;
    }

    if (!selectedPlan) {
      toast.error("No plan selected");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Create FormData for file upload
      const formData = new FormData();
      formData.append("planId", selectedPlan.id);
      formData.append("phone", phone);
      formData.append("paymentProof", paymentProof);

      // ✅ Call your API endpoint
      const response = await fetch("/api/submit-payment", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          "Payment submitted successfully! We will verify and activate your subscription within 2-4 hours."
        );
        router.push("/dashboard");
      } else {
        throw new Error(result.message || "Failed to submit payment");
      }
    } catch (error) {
      toast.error("Failed to submit payment. Please try again.");
      console.error("Payment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (): void => {
    setSelectedPlan(null);
    setPhone("");
    setPaymentProof(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setPaymentProof(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Medical AI Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to AI medical consultations and expert health
            guidance
          </p>
        </div>

        {!selectedPlan ? (
          /* Plans Selection */
          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="inline w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    {plan.id === "premium" && (
                      <Crown className="w-8 h-8 text-yellow-500" />
                    )}
                    {plan.id === "basic" && (
                      <Star className="w-8 h-8 text-blue-500" />
                    )}
                    {plan.id === "free" && (
                      <Check className="w-8 h-8 text-green-500" />
                    )}
                  </div>

                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-4">
                    {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    {plan.price > 0 && (
                      <span className="text-lg text-gray-500">/month</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full text-lg py-6 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-900"
                    }`}
                  >
                    {plan.price === 0 ? "Start Free" : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Payment Section */
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Plans
                  </Button>
                  <Badge variant="secondary" className="bg-white text-blue-600">
                    {selectedPlan.name} Plan
                  </Badge>
                </div>

                <CardTitle className="text-2xl text-center mt-4">
                  Complete Your Payment
                </CardTitle>
                <CardDescription className="text-blue-100 text-center">
                  Scan QR code with any UPI app to pay ₹{selectedPlan.price}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* QR Code Section */}
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-lg">Scan & Pay</h3>

                    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
                      <QRCode
                        value={generateUPILink(selectedPlan)}
                        size={200}
                        level="M"
                      />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        Amount: ₹{selectedPlan.price}
                      </p>
                      <p className="text-xs text-green-600">
                        Works with Google Pay, PhonePe, Paytm, and all UPI apps
                      </p>
                    </div>
                  </div>

                  {/* Payment Form Section */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg">
                      Payment Verification
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Upload className="w-4 h-4 inline mr-1" />
                          Payment Screenshot
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload screenshot of successful payment
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Payment Steps:
                      </h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Scan QR code or pay to: {UPI_ID}</li>
                        <li>2. Pay ₹{selectedPlan.price}</li>
                        <li>3. Take screenshot of success page</li>
                        <li>4. Upload screenshot and submit</li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleSubmitPayment}
                      disabled={!phone.trim() || !paymentProof || isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Payment for Verification"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Your subscription will be activated within 2-4 hours after
                      verification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Secure UPI Payments</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Manual Verification</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
