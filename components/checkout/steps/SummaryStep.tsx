"use client";

import { useState } from "react";
import { Phone, AlertCircle } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";
import { useSendOtp } from "@/hooks/useAuth";
import { getFriendlyErrorMessage } from "@/lib/auth";
import { type CheckoutDetails } from "@/lib/checkout";

interface SummaryStepProps {
  checkout: CheckoutDetails;
}

export default function SummaryStep({ checkout }: SummaryStepProps) {
  const [phone, setPhone] = useState(checkout.phone || "");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const { mutate: sendOtp, isPending, error: sendError } = useSendOtp(checkout.checkoutSessionId);

  // Strip non-digits safely and cap at 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (internalError) setInternalError(null);
  };

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  const showInlineError = hasInteracted && phone.length === 10 && !isValidPhone;

  let errorMessage: string | null = null;
  if (internalError) {
    errorMessage = internalError;
  } else if (sendError) {
    errorMessage = getFriendlyErrorMessage(sendError, "send");
  } else if (showInlineError) {
    errorMessage = "Enter a valid 10-digit mobile number";
  }

  const handleContinue = () => {
    if (!isValidPhone) {
      setHasInteracted(true);
      return;
    }
    setInternalError(null);
    sendOtp(phone);
  };

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-4 shadow-[var(--shadow-checkout-sm)]">
          {/* Title */}
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)] mb-3">
            <span className="w-7 h-7 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-[var(--checkout-muted)]" strokeWidth={2} />
            </span>
            Contact Details
          </h2>

          {/* Phone input */}
          <div
            className={`flex items-center rounded-[var(--checkout-radius-sm)] overflow-hidden border transition-all ${
              errorMessage
                ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                : "border-[var(--checkout-border)] focus-within:border-[var(--checkout-primary)] focus-within:ring-1 focus-within:ring-[var(--checkout-primary)]"
            }`}
          >
            <span className="px-3 py-2.5 text-sm font-medium text-[var(--checkout-heading)] border-r border-[var(--checkout-border)] flex-shrink-0 bg-[var(--checkout-card-bg)]">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter your phone number"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => setHasInteracted(true)}
              disabled={isPending}
              className="flex-1 min-w-0 px-3 py-2.5 text-sm text-[var(--checkout-heading)] bg-transparent outline-none placeholder:text-[var(--checkout-muted)] disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValidPhone) {
                  handleContinue();
                }
              }}
            />
          </div>
          
          {/* Inline Error */}
          {errorMessage && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Notify checkbox */}
          <label className="flex items-center gap-2 mt-3 text-xs text-[var(--checkout-body)] cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled={isPending}
              className="w-3.5 h-3.5 rounded accent-[var(--checkout-primary)] flex-shrink-0 disabled:opacity-50"
            />
            Notify me about offers & updates
          </label>
        </div>

        <TrustBadges />
      </div>

      {/* Single Unified CTA */}
      <div className="mt-auto md:mt-16 lg:mt-24 sticky md:static bottom-0 -mx-4 md:mx-0 px-4 md:px-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0 md:pt-0 bg-[var(--checkout-card-bg)] md:bg-transparent z-10 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!isValidPhone || isPending}
          className="w-full md:w-[160px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base md:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Sending OTP..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
