"use client";

import { CheckCircle } from "lucide-react";

export default function CompletedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--gf-primary-pale)] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[var(--gf-primary)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--checkout-heading)] mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-[var(--checkout-muted)]">
          Your payment has been received. Thank you for your order.
        </p>
      </div>
    </div>
  );
}
