"use client";

import { Clock } from "lucide-react";

interface FutureStepPlaceholderProps {
  step: string;
}

export default function FutureStepPlaceholder({
  step,
}: FutureStepPlaceholderProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-full bg-[var(--gf-primary-pale)] flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-[var(--gf-primary)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--checkout-heading)] mb-2">
          Checkout in Progress
        </h1>
        <p className="text-sm text-[var(--checkout-muted)]">
          This checkout is at the <strong>{step}</strong> step. Full
          functionality is coming in a future update.
        </p>
      </div>
    </div>
  );
}
