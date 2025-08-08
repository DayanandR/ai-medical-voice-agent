"use client";
import React, { useState, useEffect } from "react";
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
import { Check, Crown, Star, Phone, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

// ✅ PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86', // UAT for testing
  saltKey: process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076', // UAT salt
  saltIndex: 1,
  apiEndpoint: process.env.NODE_ENV === 'production' 
    ? 'https://api.phonepe.com/apis/hermes' 
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox', // UAT endpoint
  redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment-success`
};

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

export default function PhonePeBillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");

  // ✅ Generate unique transaction ID
  const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // ✅ Create PhonePe payment request
  const initiatePhonePePayment = async (plan: SubscriptionPlan) => {
    if (!phone.trim() || !email.trim()) {
      toast.error("Please enter your phone number and email");
      return;
    }

    const txnId = generateTransactionId();
    setTransactionId(txnId);
    setIsProcessing(true);

    try {
      const paymentData = {
        merchantId: PHONEPE_CONFIG.merchantId,
        merchantTransactionId: txnId,
        merchantUserId: `USER_${Date.now()}`,
        amount: plan.price * 100, // Amount in paise
        redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?txnId=${txnId}`,
        redirectMode: "POST",
        callbackUrl: `${window.location.origin}/api/phonepe/webhook`,
        mobileNumber: phone,
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      // Call your backend API to initiate payment
      const response = await fetch('/api/phonepe/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentData, 
          planId: plan.id,
          customerEmail: email 
        })
      });

      const result = await response.json();

      if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
        // Redirect to PhonePe payment page
        window.location.href = result.data.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('PhonePe payment error:', error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan): void => {
    if (plan.price === 0) {
      toast.success("Free plan activated successfully!");
      return;
    }
    setSelectedPlan(plan);
  };

  const handleBack = (): void => {
    setSelectedPlan(null);
    setPhone("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Powered by PhonePe</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Medical AI Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure payments with instant confirmation • 0% charges on UPI payments
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
                    {plan.id === "premium" && <Crown className="w-8 h-8 text-yellow-500" />}
                    {plan.id === "basic" && <Star className="w-8 h-8 text-blue-500" />}
                    {plan.id === "free" && <Check className="w-8 h-8 text-green-500" />}
                  </div>

                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mt-4">
                    {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    {plan.price > 0 && <span className="text-lg text-gray-500">/month</span>}
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
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
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
                  Secure PhonePe Payment
                </CardTitle>
                <CardDescription className="text-blue-100 text-center">
                  Pay ₹{selectedPlan.price} • Instant confirmation • 0% UPI charges
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <div className="space-y-6">
                  
                  {/* Customer Details */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* PhonePe Features */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Secure Payment with PhonePe
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span>0% UPI charges</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span>Real-time confirmation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span>Bank-grade security</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        <span>Instant activation</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={() => initiatePhonePePayment(selectedPlan)}
                    disabled={!phone.trim() || !email.trim() || isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to PhonePe...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ₹{selectedPlan.price} with PhonePe
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    You'll be redirected to PhonePe's secure payment page
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">0% UPI Charges</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Real-time Processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">99.999% Uptime</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
