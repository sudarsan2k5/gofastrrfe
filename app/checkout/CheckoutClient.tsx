"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useCheckoutDetails } from "@/hooks/useCheckoutDetails";
import { CHECKOUT_STEPS } from "@/lib/checkout";
import type { ApiError } from "@/lib/api";

import CheckoutShell from "@/components/checkout/CheckoutShell";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import CheckoutPanelBody from "@/components/checkout/CheckoutPanelBody";
import OrderSummary from "@/components/checkout/OrderSummary";
import TrustBadges from "@/components/checkout/TrustBadges";
import CouponCardPlaceholder from "@/components/checkout/CouponCardPlaceholder";
import UpsellPlaceholder from "@/components/checkout/UpsellPlaceholder";
import ErrorScreen from "@/components/checkout/ErrorScreen";
import CompletedScreen from "@/components/checkout/CompletedScreen";
import FutureStepPlaceholder from "@/components/checkout/FutureStepPlaceholder";

const uuidSchema = z.string().uuid();

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[var(--checkout-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/** Figma delivery banner: pill with left/right chevrons */
function DeliveryBanner() {
  return (
    <div className="flex items-center justify-between bg-[var(--checkout-card-bg)] border border-[#0B7E63]/10 rounded-full px-5 py-3 md:py-3.5 shadow-[0_8px_40px_rgba(11,126,99,0.2)]">
      <button className="p-1 opacity-60 hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-4 h-4 text-[var(--checkout-heading)]" />
      </button>
      <span className="text-sm font-medium text-[var(--checkout-heading)]">
        Get it delivered in 3-7 days 🚀
      </span>
      <button className="p-1 opacity-60 hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-[var(--checkout-heading)]" />
      </button>
    </div>
  );
}

/** Contact Details card matching Figma: phone icon, green-bordered input, checkbox, trust badges inside */
function ContactDetailsCard() {
  return (
    <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-4 shadow-[var(--shadow-checkout-sm)]">
      {/* Title */}
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)] mb-3">
        <span className="w-7 h-7 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center flex-shrink-0">
          <Phone className="w-3.5 h-3.5 text-[var(--checkout-muted)]" strokeWidth={2} />
        </span>
        Contact Details
      </h2>

      {/* Phone input — glows green on focus */}
      <div
        className="flex items-center rounded-[var(--checkout-radius-sm)] overflow-hidden border border-[var(--checkout-border)] focus-within:border-[var(--checkout-primary)] focus-within:ring-1 focus-within:ring-[var(--checkout-primary)] transition-all"
      >
        <span className="px-3 py-2.5 text-sm font-medium text-[var(--checkout-heading)] border-r border-[var(--checkout-border)] flex-shrink-0 bg-[var(--checkout-card-bg)]">
          +91
        </span>
        <input
          type="tel"
          disabled
          placeholder="Enter your phone number"
          className="flex-1 min-w-0 px-3 py-2.5 text-sm text-[var(--checkout-heading)] bg-transparent outline-none cursor-not-allowed placeholder:text-[var(--checkout-muted)] disabled:opacity-50"
        />
      </div>

      {/* Notify checkbox */}
      <label className="flex items-center gap-2 mt-3 text-xs text-[var(--checkout-body)] cursor-not-allowed">
        <input
          type="checkbox"
          disabled
          defaultChecked
          className="w-3.5 h-3.5 rounded accent-[var(--checkout-primary)] flex-shrink-0 disabled:opacity-50"
        />
        Notify me about offers &amp; updates
      </label>
    </div>
  );
}

export default function CheckoutClient() {
  const params = useSearchParams();
  const rawSession = params.get("session");

  const sessionId = uuidSchema.safeParse(rawSession).success ? rawSession : null;
  const isInvalidLink = !rawSession || !sessionId;

  const { data, isLoading, isError, error, refetch } =
    useCheckoutDetails(sessionId);

  /* ── Invalid/missing session ─── */
  if (isInvalidLink) {
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <ErrorScreen variant="invalid-link" />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── Loading ─── */
  if (isLoading) {
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <Spinner />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── Error ─── */
  if (isError) {
    const apiErr = error as ApiError | undefined;
    const is404 = apiErr?.status === 404;
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <ErrorScreen
          variant={is404 ? "not-found" : "network-error"}
          onRetry={is404 ? undefined : () => refetch()}
        />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  if (!data) return null;

  const { step, branding, lineItems, totals, currency } = data;

  /* ── COMPLETED ─── */
  if (step === CHECKOUT_STEPS.COMPLETED) {
    return (
      <CheckoutShell>
        <CheckoutHeader storeName={branding.storeName} logoUrl={branding.logoUrl} showClose />
        <CompletedScreen />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── CART — primary F1 view ─── */
  if (step === CHECKOUT_STEPS.CART) {
    /* Desktop LEFT column */
    const leftContent = (
      <>
        <DeliveryBanner />
        <OrderSummary lineItems={lineItems} totals={totals} currency={currency} />
        <CouponCardPlaceholder />
        <UpsellPlaceholder />
      </>
    );

    /* Desktop RIGHT column — white bg, handled by CheckoutPanelBody */
    const rightContent = (
      <>
        <ContactDetailsCard />
        <TrustBadges />
        {/* Continue CTA - Desktop right aligned with spacing */}
        <div className="flex justify-end mt-16 md:mt-24">
          <button
            disabled
            className="w-[160px] py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-sm font-semibold cursor-not-allowed opacity-60 transition-colors"
          >
            Continue
          </button>
        </div>
      </>
    );

    return (
      <CheckoutShell>
        {/* ── Desktop: two-column panel body ─── */}
        <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
          <CheckoutPanelBody
            left={leftContent}
            right={rightContent}
            header={
              <CheckoutHeader
                storeName={branding.storeName}
                logoUrl={branding.logoUrl}
                showClose
              />
            }
          />
        </div>

        {/* ── Mobile: single column ─── */}
        <div className="flex md:hidden flex-col flex-1 overflow-y-auto">
          {/* Mobile Header at the top */}
          <CheckoutHeader
            storeName={branding.storeName}
            logoUrl={branding.logoUrl}
            showClose
          />

          {/* Mobile content order: banner, collapsed summary, coupon, contact+badges */}
          <div className="px-4 pt-4 pb-2 space-y-3">
            <DeliveryBanner />

            {/* Collapsed order summary on mobile — shows header only with total */}
            <OrderSummary
              lineItems={lineItems}
              totals={totals}
              currency={currency}
              collapsed
            />

            <CouponCardPlaceholder />

            <ContactDetailsCard />

            <TrustBadges />
          </div>

          {/* Sticky bottom area: safe spacing + CTA */}
          <div className="md:hidden mt-auto px-4 pt-4 pb-8 border-t border-[var(--checkout-border)] bg-[var(--checkout-card-bg)] flex flex-col gap-3">
            <button
              disabled
              className="w-full h-[58px] rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base font-semibold cursor-not-allowed opacity-60"
            >
              Continue
            </button>
          </div>
        </div>

        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── Future steps ─── */
  return (
    <CheckoutShell>
      <div className="flex flex-col h-full bg-[var(--checkout-card-bg)]">
        <CheckoutHeader storeName={branding.storeName} logoUrl={branding.logoUrl} showClose />
        <FutureStepPlaceholder step={step} />
      </div>
      <CheckoutFooter />
    </CheckoutShell>
  );
}
