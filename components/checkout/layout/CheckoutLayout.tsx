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
          Unified Grid/Flex Layout for Desktop and Mobile 
          On Desktop: flex-row, side-by-side
          On Mobile: flex-col, stacked. The sidebar handles mobile specific display logic.
        */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden md:bg-transparent bg-[var(--checkout-card-bg)]">
          
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

          {/* On Mobile: We want a single scrollable area containing both Left and Right columns. 
              On Desktop: Left column is static/scrollable independently, Right column is scrollable independently. 
              We'll use a wrapper that scrolls on mobile, but flexes on desktop.
          */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-visible">
            {/* Left Column: Order Sidebar */}
            <div className="order-1 flex-none md:flex-1 md:overflow-y-auto md:flex-shrink-0 px-4 md:px-6 pt-4 pb-0 md:py-6 flex flex-col gap-3 md:gap-4 z-0">
              <OrderSidebar checkout={checkout} />
            </div>

            {/* Right Column: Active Step */}
            <div className="order-2 flex-1 flex flex-col min-w-0 md:overflow-hidden relative z-0">
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
              
              <div className="flex-none md:flex-1 md:overflow-y-auto overflow-x-hidden scrollbar-none h-full flex flex-col">
                <div className="px-4 md:px-6 pt-3 md:pt-4 pb-0 md:pb-8 flex flex-col bg-[var(--checkout-card-bg)] md:rounded-bl-[var(--checkout-radius-panel)] flex-1">
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
