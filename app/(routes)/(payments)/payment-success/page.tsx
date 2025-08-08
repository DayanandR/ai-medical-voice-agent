import { Suspense } from "react";
import PaymentClient from "../_components/PaymentClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentClient />
    </Suspense>
  );
}
