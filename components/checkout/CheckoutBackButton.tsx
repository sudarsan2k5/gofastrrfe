"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import { useStepBack } from "@/hooks/useCheckoutNavigation";
import { CHECKOUT_STEPS } from "@/lib/checkout";
import { useState, useEffect } from "react";

interface CheckoutBackButtonProps {
  step: string;
  checkoutSessionId: string;
}

export default function CheckoutBackButton({ step, checkoutSessionId }: CheckoutBackButtonProps) {
  const [error, setError] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { mutate: goBack, isPending } = useStepBack(checkoutSessionId);

  useEffect(() => {
    const handleProcessingChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isProcessing: boolean }>;
      setIsProcessingPayment(customEvent.detail.isProcessing);
    };
    window.addEventListener("payment-processing-change", handleProcessingChange);
    return () => window.removeEventListener("payment-processing-change", handleProcessingChange);
  }, []);

  // States where back button is hidden
  if (
    step === CHECKOUT_STEPS.CART ||
    step === CHECKOUT_STEPS.COMPLETED ||
    step === CHECKOUT_STEPS.PARTIALLY_PAID
  ) {
    return null;
  }

  // If payment is actively polling via webhooks, do not allow going back
  if (isProcessingPayment) {
    return null;
  }

  const handleBack = () => {
    setError(false);
    goBack(undefined, {
      onError: () => setError(true),
      onSuccess: () => {
        // Clear local OTP delivery state if navigating back from OTP_SENT
        if (step === CHECKOUT_STEPS.OTP_SENT && typeof window !== "undefined") {
          sessionStorage.removeItem(`otp_delivery_${checkoutSessionId}`);
        }
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleBack}
        disabled={isPending}
        className="flex items-center gap-1 pl-1 pr-3 py-1.5 rounded-full border border-transparent hover:border-[var(--checkout-border)] hover:bg-[var(--gf-surface-alt)] text-[var(--checkout-muted)] hover:text-[var(--checkout-heading)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--checkout-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go back"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--checkout-primary)]" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">Back</span>
      </button>
      
      {error && (
        <span className="text-xs text-red-500 whitespace-nowrap absolute top-14 left-4 md:left-6">
          Could not go back. Please try again.
        </span>
      )}
    </div>
  );
}
