"use client";

import type { ReactNode } from "react";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import OrderSidebar from "@/components/checkout/layout/OrderSidebar";
import { type CheckoutDetails } from "@/lib/checkout";

interface CheckoutLayoutProps {
  checkout: CheckoutDetails;
  children: ReactNode;
}

export default function CheckoutLayout({ checkout, children }: CheckoutLayoutProps) {
  const { branding } = checkout;

  return (
    <div className="checkout-theme h-full">
      <CheckoutShell>
        {/* 
          Unified Layout for Desktop and Mobile 
          On Desktop: CSS grid, side-by-side with enforced 42/58 split
          On Mobile: single column, stacked
        */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden md:bg-transparent bg-[var(--checkout-card-bg)]">
          
          {/* Mobile Header - only visible on mobile, at the top */}
          <div className="block md:hidden">
            <CheckoutHeader
              storeName={branding.storeName}
              logoUrl={branding.logoUrl}
              showClose
              step={checkout.step}
              checkoutSessionId={checkout.checkoutSessionId}
            />
          </div>

          {/* 
            On Mobile: single column scrollable area
            On Desktop: CSS grid with enforced fr-based column split.
            minmax(0, Xfr) prevents either column from exceeding its share.
          */}
          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden md:grid md:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] w-full max-w-full">
            {/* Left Column: Order Sidebar */}
            <div className="min-w-0 w-full max-w-full overflow-x-hidden md:overflow-y-auto px-4 md:px-6 pt-4 pb-0 md:py-6 flex flex-col gap-3 md:gap-4">
              <OrderSidebar checkout={checkout} />
            </div>

            {/* Right Column: Active Step */}
            <div className="min-w-0 w-full max-w-full overflow-x-hidden flex flex-col md:overflow-hidden relative">
              {/* Desktop Header - only visible on desktop, inside the right column */}
              <div className="hidden md:block">
                <CheckoutHeader
                  storeName={branding.storeName}
                  logoUrl={branding.logoUrl}
                  showClose
                  step={checkout.step}
                  checkoutSessionId={checkout.checkoutSessionId}
                />
              </div>
              
              <div className="flex-none md:flex-1 md:overflow-y-auto overflow-x-hidden scrollbar-none h-full flex flex-col min-w-0">
                <div className="px-4 md:px-6 pt-3 md:pt-4 pb-0 md:pb-8 flex flex-col bg-[var(--checkout-card-bg)] md:rounded-bl-[var(--checkout-radius-panel)] flex-1 min-w-0">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CheckoutFooter />
      </CheckoutShell>
    </div>
  );
}
