"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";
import {
  useVerifyOtp,
  useResendOtp,
  useEditPhone,
  getOtpDeliveryUiState,
} from "@/hooks/useAuth";
import { getFriendlyErrorMessage } from "@/lib/auth";
import { type CheckoutDetails } from "@/lib/checkout";

interface OtpStepProps {
  checkout: CheckoutDetails;
}

export default function OtpStep({ checkout }: OtpStepProps) {
  const sessionId = checkout.checkoutSessionId;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const uiState = getOtpDeliveryUiState(sessionId);
  const [remainingTime, setRemainingTime] = useState(() => {
    if (uiState.deliveryMode === "failed") return 0;
    if (!uiState.sentAt) return 0;
    const elapsed = Math.floor((Date.now() - uiState.sentAt) / 1000);
    return Math.max(0, 30 - elapsed);
  });

  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyOtp(sessionId);
  const { mutate: resendOtp, isPending: isResending, error: resendError } = useResendOtp(sessionId);
  const { mutate: editPhone, isPending: isEditing, error: editError } = useEditPhone(sessionId);

  // Timer logic
  useEffect(() => {
    const calcRemaining = () => {
      if (uiState.deliveryMode === "failed") return 0;
      if (!uiState.sentAt) return 0;
      const elapsed = Math.floor((Date.now() - uiState.sentAt) / 1000);
      return Math.max(0, 30 - elapsed);
    };

    const interval = setInterval(() => {
      setRemainingTime(calcRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [uiState.sentAt, uiState.deliveryMode]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    setHasInteracted(true);
    const newOtp = [...otp];
    
    // Support paste
    if (value.length > 1) {
      const pasted = value.slice(0, 4).split("");
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 4) newOtp[index + i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasted.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value !== "" && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === 4 && !isVerifying) {
      verifyOtp(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedPhone = checkout.phone ? `+91 ${checkout.phone.slice(0, 2)}xxxxxx${checkout.phone.slice(-2)}` : "";

  let errorMessage: string | null = null;
  if (uiState.deliveryMode === "failed") {
    errorMessage = "We could not deliver the OTP. Please resend it.";
  }
  if (verifyError) {
    errorMessage = getFriendlyErrorMessage(verifyError, "verify");
  } else if (resendError) {
    errorMessage = getFriendlyErrorMessage(resendError, "resend");
  } else if (editError) {
    errorMessage = getFriendlyErrorMessage(editError, "edit");
  }

  const isWorking = isVerifying || isResending || isEditing;

  return (
    <div className="flex flex-col flex-1 h-full relative min-w-0">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-6 shadow-[var(--shadow-checkout-sm)] flex flex-col items-center text-center">
          
          <h2 className="text-base font-semibold text-[var(--checkout-heading)] mb-1">
            Enter 4 digit code sent on
          </h2>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[var(--checkout-primary)] font-medium text-sm">
              {maskedPhone}
            </span>
            <button 
              onClick={() => editPhone()} 
              disabled={isWorking}
              className="p-1 hover:bg-[var(--gf-surface-alt)] rounded-full transition-colors disabled:opacity-50"
              aria-label="Edit number"
            >
              <Image src="/icons/checkout/pencile.svg" alt="Edit" width={16} height={16} />
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isWorking}
                className={`w-12 h-14 text-center text-xl font-semibold rounded-[var(--checkout-radius-sm)] border outline-none transition-all disabled:opacity-50 ${
                  verifyError && hasInteracted
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-500"
                    : "border-[var(--checkout-border)] focus:border-[var(--checkout-primary)] focus:ring-1 focus:ring-[var(--checkout-primary)] text-[var(--checkout-heading)]"
                }`}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="mb-4 text-xs text-red-500 flex items-center gap-1 justify-center">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="text-xs text-[var(--checkout-muted)] mb-3">
            {remainingTime > 0 ? (
              <span>Resend OTP in <span className="font-medium text-[var(--checkout-heading)]">00:{remainingTime.toString().padStart(2, '0')}</span></span>
            ) : (
              <span>Resend OTP via</span>
            )}
          </div>

          <div className="flex gap-8">
            <button
              onClick={() => resendOtp()}
              disabled={isWorking || remainingTime > 0}
              className="flex flex-col items-center gap-1.5 disabled:opacity-50 transition-opacity"
            >
              <Image src="/icons/checkout/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
              <span className="text-[11px] text-[var(--checkout-body)]">Whatsapp</span>
            </button>
            <button
              onClick={() => resendOtp()}
              disabled={isWorking || remainingTime > 0}
              className="flex flex-col items-center gap-1.5 disabled:opacity-50 transition-opacity"
            >
              <Image src="/icons/checkout/message.svg" alt="Message" width={24} height={24} />
              <span className="text-[11px] text-[var(--checkout-body)]">Message</span>
            </button>
          </div>
          
        </div>

        <TrustBadges />
      </div>

      {/* Single Unified CTA */}
      <div className="mt-auto md:mt-16 lg:mt-24 sticky md:static bottom-0 -mx-4 md:mx-0 px-4 md:px-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0 md:pt-0 bg-[var(--checkout-card-bg)] md:bg-transparent z-10 flex justify-end">
        <button
          onClick={() => {
            const fullOtp = otp.join("");
            if (fullOtp.length === 4) verifyOtp(fullOtp);
          }}
          disabled={otp.join("").length !== 4 || isWorking}
          className="w-full md:w-[160px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base md:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
