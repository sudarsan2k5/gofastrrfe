"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";
import { useInitPayment } from "@/hooks/usePayment";
import { getPaymentErrorMessage } from "@/lib/payment";
import { loadRazorpayScript, type RazorpayOptions } from "@/lib/razorpay";
import { type CheckoutDetails, formatPaise, CHECKOUT_STEPS } from "@/lib/checkout";
import { useQueryClient } from "@tanstack/react-query";
import { checkoutDetailsQueryKey } from "@/hooks/useCheckoutDetails";

/* ── Payment method definitions ── */

type RazorpayMethod = "upi" | "card" | "wallet" | "netbanking" | "emi";

interface PaymentMethodDef {
  id: RazorpayMethod;
  title: string;
  subtitle: string;
  icon: string;         // path under /icons/checkout/
  displayName: string;  // shown inside Razorpay modal block title
}

const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: "upi",
    title: "UPI",
    subtitle: "Pay through UPI apps",
    icon: "/icons/checkout/upi.svg",
    displayName: "Pay via UPI",
  },
  {
    id: "card",
    title: "Debit/Credit Cards",
    subtitle: "Pay via RuPay, Visa, MasterCard",
    icon: "/icons/checkout/debit_credit_cards.svg",
    displayName: "Pay via Card",
  },
  {
    id: "wallet",
    title: "Wallets",
    subtitle: "PhonePe, Airtel, Paytm & more",
    icon: "/icons/checkout/wallets.svg",
    displayName: "Pay via Wallet",
  },
  {
    id: "netbanking",
    title: "Netbanking",
    subtitle: "Pay directly from your bank",
    icon: "/icons/checkout/secured-payment.svg",
    displayName: "Pay via Netbanking",
  },
  {
    id: "emi",
    title: "EMI",
    subtitle: "Pay via supported card EMI",
    icon: "/icons/checkout/emi.svg",
    displayName: "Pay via EMI",
  },
];

/* ── Component ── */

interface PaymentStepProps {
  checkout: CheckoutDetails;
}

export default function PaymentStep({ checkout }: PaymentStepProps) {
  const sessionId = checkout.checkoutSessionId;
  const queryClient = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMethod, setActiveMethod] = useState<RazorpayMethod | null>(null);
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

  const handleMethodClick = async (method: PaymentMethodDef) => {
    if (isInitializing || isProcessing || pollTimeout) return;

    setInternalError(null);
    setPollTimeout(false);
    setActiveMethod(method.id);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setInternalError("Could not load payment gateway. Please try again.");
      setActiveMethod(null);
      return;
    }

    // Backend still receives "FULL" — instrument selection is frontend-only for Phase 1
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
            contact: (checkout.phone ?? "").replace(/^\+91/, ""),
          },
          handler: () => {
            startPolling();
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setActiveMethod(null);
              setInternalError("Payment was not completed. You can try again.");
            },
          },
          theme: {
            color: "#0B7E63",
          },
          // Method-specific Razorpay config
          config: {
            display: {
              blocks: {
                selected: {
                  name: method.displayName,
                  instruments: [{ method: method.id }],
                },
              },
              sequence: ["block.selected"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", () => {
          setIsProcessing(false);
          setActiveMethod(null);
          setInternalError("Payment failed. Please try again.");
        });

        setIsProcessing(true);
        rzp.open();
      },
      onError: () => {
        setActiveMethod(null);
      },
    });
  };

  const isRowDisabled =
    !checkout.totals.totalPaise ||
    !checkout.phone ||
    !checkout.email ||
    !checkout.shippingAddress ||
    isInitializing ||
    isProcessing ||
    pollTimeout;

  const apiErrorMessage = initError ? getPaymentErrorMessage(initError) : null;
  const errorMessage = internalError || apiErrorMessage;

  const formattedTotal = formatPaise(checkout.totals.totalPaise, checkout.currency);

  return (
    <div className="flex flex-col flex-1 h-full relative min-w-0">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-4 shadow-[var(--shadow-checkout-sm)]">
          {/* Title */}
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)] mb-1">
            <span className="w-7 h-7 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--checkout-muted)]">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
            Payment
          </h2>
          <p className="text-xs text-[var(--checkout-muted)] mb-4 ml-9">
            Select a payment method to complete your order.
          </p>

          {/* ── Payment method rows ── */}
          <div className="space-y-2 ml-0 md:ml-0">
            {PAYMENT_METHODS.map((method) => {
              const isActive = activeMethod === method.id;
              const isLoading = isActive && (isInitializing || isProcessing);

              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodClick(method)}
                  disabled={isRowDisabled}
                  className={`
                    w-full flex items-center gap-3 p-3 md:p-3.5
                    rounded-[var(--checkout-radius-sm)]
                    border transition-all text-left
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isActive
                      ? "border-[var(--checkout-primary)] bg-[color-mix(in_srgb,var(--checkout-primary)_5%,var(--checkout-card-bg))] shadow-sm"
                      : "border-[var(--checkout-border)] bg-[var(--gf-surface-alt)] hover:border-[var(--checkout-primary)]/40 hover:bg-[color-mix(in_srgb,var(--checkout-primary)_3%,var(--gf-surface-alt))]"
                    }
                    ${isRowDisabled && !isActive ? "hover:border-[var(--checkout-border)] hover:bg-[var(--gf-surface-alt)]" : ""}
                  `}
                >
                  {/* Method icon */}
                  <span className="w-10 h-10 rounded-[var(--checkout-radius-sm)] bg-[var(--checkout-card-bg)] border border-[var(--checkout-border)] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={method.icon}
                      alt={method.title}
                      width={22}
                      height={22}
                    />
                  </span>

                  {/* Title + subtitle */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--checkout-heading)] truncate">
                      {method.title}
                    </p>
                    <p className="text-[11px] text-[var(--checkout-muted)] mt-0.5 truncate">
                      {method.subtitle}
                    </p>
                  </div>

                  {/* Amount + loading state */}
                  <div className="flex-shrink-0 text-right">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-[var(--checkout-primary)] animate-spin" />
                    ) : (
                      <p className="text-sm font-semibold text-[var(--checkout-heading)]">
                        {formattedTotal}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Security note */}
          <p className="text-xs text-[var(--checkout-muted)] mt-4 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your payment is processed securely by Razorpay.
          </p>

          {/* Errors */}
          {errorMessage && (
            <div className="mt-3 text-xs text-red-500 flex items-start gap-1.5 p-2.5 bg-red-50 rounded-[var(--checkout-radius-sm)] border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Poll Timeout State */}
          {pollTimeout && (
            <div className="mt-3 text-xs text-amber-600 flex flex-col items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-[var(--checkout-radius-sm)]">
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
    </div>
  );
}
