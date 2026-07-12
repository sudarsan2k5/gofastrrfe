"use client";

import Image from "next/image";
import { X, Check } from "lucide-react";
import CheckoutBackButton from "@/components/checkout/CheckoutBackButton";
import { CHECKOUT_STEPS } from "@/lib/checkout";

interface CheckoutHeaderProps {
  storeName?: string | null;
  logoUrl?: string | null;
  showClose?: boolean;
  step?: string;
  checkoutSessionId?: string;
}

/* ── Breadcrumb step mapping ─── */

type BreadcrumbState = "completed" | "active" | "upcoming";

function getBreadcrumbStates(step?: string): {
  summary: BreadcrumbState;
  address: BreadcrumbState;
  payment: BreadcrumbState;
} {
  if (!step) return { summary: "active", address: "upcoming", payment: "upcoming" };

  switch (step) {
    case CHECKOUT_STEPS.CART:
    case CHECKOUT_STEPS.OTP_SENT:
      return { summary: "active", address: "upcoming", payment: "upcoming" };

    case CHECKOUT_STEPS.OTP_VERIFIED:
    case CHECKOUT_STEPS.ADDRESS_SAVED:
      return { summary: "completed", address: "active", payment: "upcoming" };

    case CHECKOUT_STEPS.PAYMENT_READY:
    case CHECKOUT_STEPS.PAYMENT_INITIATED:
    case CHECKOUT_STEPS.FAILED:
      return { summary: "completed", address: "completed", payment: "active" };

    case CHECKOUT_STEPS.COMPLETED:
    case CHECKOUT_STEPS.PARTIALLY_PAID:
      return { summary: "completed", address: "completed", payment: "completed" };

    default:
      return { summary: "active", address: "upcoming", payment: "upcoming" };
  }
}

function BreadcrumbItem({
  label,
  state,
}: {
  label: string;
  state: BreadcrumbState;
}) {
  if (state === "completed") {
    return (
      <span className="flex items-center gap-1 text-[var(--checkout-primary)] font-medium">
        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
        {label}
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="font-semibold text-[var(--checkout-heading)]">
        {label}
      </span>
    );
  }
  return <span className="text-[var(--checkout-muted)]">{label}</span>;
}

export default function CheckoutHeader({
  storeName,
  logoUrl,
  showClose = false,
  step,
  checkoutSessionId,
}: CheckoutHeaderProps) {
  const breadcrumbs = getBreadcrumbStates(step);

  return (
    <header className="flex flex-col bg-[var(--checkout-card-bg)] flex-shrink-0 relative">
      {/* Top row: 3-zone grid — Left (back+logo) | spacer | Right (close) */}
      <div className="flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4">
        {/* Left zone: back button + logo */}
        <div className="flex items-center gap-2 min-w-0">
          {step && checkoutSessionId && (
            <CheckoutBackButton
              step={step}
              checkoutSessionId={checkoutSessionId}
            />
          )}

          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName ?? "Store"}
              width={28}
              height={28}
              className="rounded object-contain flex-shrink-0"
              unoptimized
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/logos/gofastrr-logo.svg"
              alt="GoFastrr"
              width={28}
              height={28}
              className="w-[28px] h-[28px] flex-shrink-0"
            />
          )}
          {storeName && (
            <span className="text-lg font-bold text-[var(--gf-primary)] truncate max-w-[150px]">
              {storeName}
            </span>
          )}
        </div>

        {/* Right zone: close button */}
        {showClose && (
          <button
            aria-label="Close checkout"
            disabled
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--checkout-heading)] hover:bg-[var(--gf-surface-alt)] transition-colors cursor-not-allowed flex-shrink-0"
          >
            <X className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-[var(--checkout-border)] w-full" />

      {/* Bottom row: Dynamic breadcrumbs — right-aligned */}
      <div className="flex items-center justify-end px-5 md:px-6 py-3">
        <nav
          aria-label="Checkout progress"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <BreadcrumbItem label="Summary" state={breadcrumbs.summary} />
          <span className="text-[var(--checkout-muted)] opacity-50" aria-hidden="true">»</span>
          <BreadcrumbItem label="Address" state={breadcrumbs.address} />
          <span className="text-[var(--checkout-muted)] opacity-50" aria-hidden="true">»</span>
          <BreadcrumbItem label="Payment" state={breadcrumbs.payment} />
        </nav>
      </div>
    </header>
  );
}
