"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderSummary from "@/components/checkout/OrderSummary";
import CouponCardPlaceholder from "@/components/checkout/CouponCardPlaceholder";
import UpsellPlaceholder from "@/components/checkout/UpsellPlaceholder";
import CouponsPanel from "@/components/checkout/layout/CouponsPanel";
import { type CheckoutDetails } from "@/lib/checkout";

/** Figma delivery banner: pill with left/right chevrons */
function DeliveryBanner() {
  return (
    <div className="flex items-center justify-between bg-[var(--gf-surface-alt)] border border-[var(--checkout-border)] rounded-full px-5 py-3 md:py-3.5 md:bg-[var(--checkout-card-bg)] md:border-[var(--checkout-primary-tint)] md:shadow-[0_8px_40px_color-mix(in_srgb,var(--checkout-primary)_20%,transparent)]">
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

interface OrderSidebarProps {
  checkout: CheckoutDetails;
}

export default function OrderSidebar({ checkout }: OrderSidebarProps) {
  const { lineItems, totals, currency } = checkout;

  const showPlaceholders =
    process.env.NEXT_PUBLIC_CHECKOUT_SHOW_PLACEHOLDERS === "true";

  const [sidebarView, setSidebarView] = useState<"summary" | "coupons">("summary");

  // Force summary view if placeholders are hidden
  const effectiveView = showPlaceholders ? sidebarView : "summary";

  if (effectiveView === "coupons") {
    return (
      <div className="min-w-0 w-full max-w-full">
        <CouponsPanel onBack={() => setSidebarView("summary")} />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 min-w-0 w-full max-w-full">
      <DeliveryBanner />

      {/* 
        Responsive OrderSummary 
        On mobile, it shows only the header with the grand total. 
        On desktop, it shows the expanded line items. 
        This avoids duplicating the component!
      */}
      <OrderSummary
        lineItems={lineItems}
        totals={totals}
        currency={currency}
      />

      {showPlaceholders && (
        <CouponCardPlaceholder onOpenCoupons={() => setSidebarView("coupons")} />
      )}

      {/* Show upsells on desktop only for now as per Figma MVP Option A */}
      {showPlaceholders && (
        <div className="hidden md:block">
          <UpsellPlaceholder />
        </div>
      )}
    </div>
  );
}
