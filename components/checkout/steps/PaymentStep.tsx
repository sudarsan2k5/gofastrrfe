"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AlertCircle, RefreshCw } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";
import { useInitPayment } from "@/hooks/usePayment";
import { getPaymentErrorMessage } from "@/lib/payment";
import { loadRazorpayScript, type RazorpayOptions } from "@/lib/razorpay";
import { type CheckoutDetails, formatPaise, CHECKOUT_STEPS } from "@/lib/checkout";
import { useQueryClient } from "@tanstack/react-query";
import { checkoutDetailsQueryKey } from "@/hooks/useCheckoutDetails";

interface PaymentStepProps {
  checkout: CheckoutDetails;
}

export default function PaymentStep({ checkout }: PaymentStepProps) {
  const sessionId = checkout.checkoutSessionId;
  const queryClient = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [pollTimeout, setPollTimeout] = useState(false);

  const { mutate: initPay, isPending: isInitializing, error: initError } = useInitPayment(sessionId);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dispatch global event for CheckoutHeader back button
  useEffect(() => {
    const event = new CustomEvent("payment-processing-change", { detail: { isProcessing } });
    window.dispatchEvent(event);
    return () => {
      window.dispatchEvent(new CustomEvent("payment-processing-change", { detail: { isProcessing: false } }));
    };
  }, [isProcessing]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  // Stop processing if step advances from backend via polling
  useEffect(() => {
    if (checkout.step === CHECKOUT_STEPS.COMPLETED || checkout.step === CHECKOUT_STEPS.PARTIALLY_PAID) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    }
  }, [checkout.step]);

  const startPolling = () => {
    setIsProcessing(true);
    setInternalError(null);
    setPollTimeout(false);

    // Initial immediate fetch
    queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });

    pollIntervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    }, 2000); // 2 seconds

    pollTimerRef.current = setTimeout(() => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setPollTimeout(true);
    }, 60000); // 60 seconds
  };

  const handlePayNow = async () => {
    setInternalError(null);
    setPollTimeout(false);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setInternalError("Could not load payment gateway. Please try again.");
      return;
    }

    initPay("FULL", {
      onSuccess: (data) => {
        const options: RazorpayOptions = {
          key: data.key,
          amount: data.amountPaise,
          currency: data.currency,
          name: checkout.branding.storeName || "GoFastrr Checkout",
          description: "Order Payment",
          image: checkout.branding.logoUrl || undefined,
          order_id: data.gatewayOrderId,
          prefill: {
            name: `${checkout.shippingAddress?.firstName ?? ""} ${checkout.shippingAddress?.lastName ?? ""}`.trim(),
            email: checkout.email ?? "",
            contact: (checkout.phone ?? "").replace(/^\+91/, ""), // Best practice for Razorpay Indian numbers
          },
          handler: () => {
            // Razorpay success
            startPolling();
          },
          modal: {
            ondismiss: () => {
              // User closed modal
              setIsProcessing(false);
              setInternalError("Payment was not completed. You can try again.");
            },
          },
          theme: {
            color: "#0B7E63", // Default fallback if no theme color found
          },
        };

        const rzp = new window.Razorpay(options);
        
        // Listen to payment.failed event (internal Razorpay failures)
        rzp.on("payment.failed", () => {
          setIsProcessing(false);
          setInternalError("Payment failed. Please try again.");
        });

        setIsProcessing(true); // "Opening Razorpay..."
        rzp.open();
      },
    });
  };

  const isButtonDisabled =
    !checkout.totals.totalPaise ||
    !checkout.phone ||
    !checkout.email ||
    !checkout.shippingAddress ||
    isInitializing ||
    isProcessing ||
    pollTimeout;

  const apiErrorMessage = initError ? getPaymentErrorMessage(initError) : null;
  const errorMessage = internalError || apiErrorMessage;

  let buttonText = "Pay Now";
  if (isInitializing) buttonText = "Preparing payment...";
  else if (isProcessing) buttonText = "Confirming payment...";
  else if (pollTimeout) buttonText = "Confirming your order...";

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-4 shadow-[var(--shadow-checkout-sm)]">
          {/* Title */}
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)] mb-1">
            <span className="w-7 h-7 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center flex-shrink-0">
              {/* Note: In a real app we'd use a generic credit card icon or similar here if we don't have a specific payment icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--checkout-muted)]">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
            Payment
          </h2>
          <p className="text-xs text-[var(--checkout-muted)] mb-4 ml-9">
            Complete your payment securely to place the order.
          </p>

          {/* Amount */}
          <div className="mb-4 ml-9">
            <p className="text-sm text-[var(--checkout-body)]">Amount Payable</p>
            <p className="text-xl font-bold text-[var(--checkout-heading)] mt-0.5">
              {formatPaise(checkout.totals.totalPaise, checkout.currency)}
            </p>
          </div>

          {/* Payment Method Card */}
          <div className="ml-9 p-3 bg-[var(--gf-surface-alt)] border border-[var(--checkout-border)] rounded-[var(--checkout-radius-sm)] flex items-start gap-3">
            <Image src="/icons/checkout/secured-payment.svg" alt="Razorpay" width={24} height={24} className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--checkout-heading)]">Pay securely with Razorpay</p>
              <p className="text-xs text-[var(--checkout-muted)] mt-1">UPI, cards, net banking and wallets supported</p>
            </div>
          </div>

          <p className="text-xs text-[var(--checkout-muted)] mt-4 ml-9 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your payment is processed securely by Razorpay.
          </p>

          {/* Errors */}
          {errorMessage && (
            <div className="mt-4 ml-9 text-xs text-red-500 flex items-start gap-1.5 p-2 bg-red-50 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Poll Timeout State */}
          {pollTimeout && (
            <div className="mt-4 ml-9 text-xs text-amber-600 flex flex-col items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Payment received. We are confirming your order. Please do not pay again yet.
                </span>
              </div>
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded font-medium shadow-sm hover:bg-amber-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh status
              </button>
            </div>
          )}
        </div>

        <TrustBadges />
      </div>

      {/* Sticky CTA */}
      <div className="mt-auto md:mt-16 lg:mt-24 sticky md:static bottom-0 -mx-4 md:mx-0 px-4 md:px-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0 md:pt-0 bg-[var(--checkout-card-bg)] md:bg-transparent z-10 flex justify-end">
        {!pollTimeout ? (
          <button
            onClick={handlePayNow}
            disabled={isButtonDisabled}
            className="w-full md:w-[160px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base md:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {buttonText}
          </button>
        ) : (
          <button
            disabled
            className="w-full md:w-[220px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-gray-100 text-gray-500 text-base md:text-sm font-semibold cursor-not-allowed border border-gray-200"
          >
            Confirming your order...
          </button>
        )}
      </div>
    </div>
  );
}
