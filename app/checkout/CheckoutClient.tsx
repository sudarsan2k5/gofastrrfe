"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useCheckoutDetails } from "@/hooks/useCheckoutDetails";
import { CHECKOUT_STEPS } from "@/lib/checkout";
import type { ApiError } from "@/lib/api";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import OrderSummary from "@/components/checkout/OrderSummary";
import TrustBadges from "@/components/checkout/TrustBadges";
import CouponCardPlaceholder from "@/components/checkout/CouponCardPlaceholder";
import UpsellPlaceholder from "@/components/checkout/UpsellPlaceholder";
import ErrorScreen from "@/components/checkout/ErrorScreen";
import CompletedScreen from "@/components/checkout/CompletedScreen";
import FutureStepPlaceholder from "@/components/checkout/FutureStepPlaceholder";

const uuidSchema = z.string().uuid();

export default function CheckoutClient() {
  const params = useSearchParams();
  const rawSession = params.get("session");

  /* ── Validate session UUID before any fetch ─── */
  const sessionId = uuidSchema.safeParse(rawSession).success
    ? rawSession
    : null;

  const isInvalidLink = !rawSession || !sessionId;

  const { data, isLoading, isError, error, refetch } =
    useCheckoutDetails(sessionId);

  /* ── Invalid/missing session param ─── */
  if (isInvalidLink) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
        <CheckoutHeader />
        <ErrorScreen variant="invalid-link" />
        <CheckoutFooter />
      </div>
    );
  }

  /* ── Loading ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
        <CheckoutHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--checkout-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  /* ── Error states ─── */
  if (isError) {
    const apiErr = error as ApiError | undefined;
    const is404 = apiErr?.status === 404;

    return (
      <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
        <CheckoutHeader />
        <ErrorScreen
          variant={is404 ? "not-found" : "network-error"}
          onRetry={is404 ? undefined : () => refetch()}
        />
        <CheckoutFooter />
      </div>
    );
  }

  /* ── Data loaded successfully ─── */
  if (!data) return null;

  const { step, branding, lineItems, totals, currency } = data;

  /* ── COMPLETED ─── */
  if (step === CHECKOUT_STEPS.COMPLETED) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
        <CheckoutHeader
          storeName={branding.storeName}
          logoUrl={branding.logoUrl}
        />
        <CompletedScreen />
        <CheckoutFooter />
      </div>
    );
  }

  /* ── CART (primary F1 view) ─── */
  if (step === CHECKOUT_STEPS.CART) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
        <CheckoutHeader
          storeName={branding.storeName}
          logoUrl={branding.logoUrl}
        />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left column: Order summary + coupon + upsell ─── */}
            <div className="w-full lg:w-[55%] space-y-4">
              {/* Delivery banner */}
              <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] px-4 py-2.5 text-center text-sm text-[var(--checkout-body)]">
                Get it delivered in 3-7 days 🚀
              </div>

              <OrderSummary
                lineItems={lineItems}
                totals={totals}
                currency={currency}
              />

              <CouponCardPlaceholder />

              <UpsellPlaceholder />
            </div>

            {/* ── Right column: checkout step (Contact Details placeholder in F1) ─── */}
            <div className="w-full lg:w-[45%] space-y-5">
              {/* Contact Details placeholder card */}
              <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-5 shadow-[var(--shadow-checkout-sm)]">
                <h2 className="text-base font-semibold text-[var(--checkout-heading)] flex items-center gap-2 mb-4">
                  <span className="text-base">📞</span>
                  Contact Details
                </h2>

                {/* Phone input placeholder — disabled in F1 */}
                <div className="flex items-center border border-[var(--checkout-border)] rounded-[var(--checkout-radius-sm)] overflow-hidden opacity-50">
                  <span className="px-3 py-2.5 text-sm text-[var(--checkout-muted)] bg-[var(--gf-surface-alt)] border-r border-[var(--checkout-border)]">
                    +91
                  </span>
                  <input
                    type="tel"
                    disabled
                    placeholder="Enter your phone number"
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none cursor-not-allowed"
                  />
                </div>

                <label className="flex items-center gap-2 mt-3 text-xs text-[var(--checkout-muted)] opacity-50">
                  <input
                    type="checkbox"
                    disabled
                    defaultChecked
                    className="accent-[var(--checkout-primary)]"
                  />
                  Notify me about offers &amp; updates
                </label>
              </div>

              {/* Trust badges */}
              <TrustBadges />

              {/* Continue button — disabled in F1 */}
              <button
                disabled
                className="w-full py-3.5 rounded-[var(--checkout-radius-sm)] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base font-semibold opacity-50 cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </main>

        <CheckoutFooter />
      </div>
    );
  }

  /* ── All other steps — safe future placeholder ─── */
  return (
    <div className="min-h-screen flex flex-col bg-[var(--checkout-page-bg)]">
      <CheckoutHeader
        storeName={branding.storeName}
        logoUrl={branding.logoUrl}
      />
      <FutureStepPlaceholder step={step} />
      <CheckoutFooter />
    </div>
  );
}
