import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | GoFastrr",
  description: "Complete your purchase securely with GoFastrr",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--checkout-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
