"use client";

import type { ReactNode } from "react";

interface CheckoutPanelBodyProps {
  left: ReactNode;
  right: ReactNode;
  /** Edge-to-edge header for the right column */
  header?: ReactNode;
}

export default function CheckoutPanelBody({
  left,
  right,
  header,
}: CheckoutPanelBodyProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
      {/* LEFT — order summary side */}
      <div className="order-2 lg:order-1 flex-1 lg:overflow-y-auto lg:flex-shrink-0 px-4 md:px-6 py-6 space-y-4 overflow-x-hidden">
        {left}
      </div>

      {/* RIGHT — active checkout step */}
      <div className="order-1 lg:order-2 flex-1 flex flex-col min-w-0 overflow-hidden">
        {header}
        <div className="flex-1 lg:overflow-y-auto overflow-x-hidden scrollbar-none">
          <div className="px-5 md:px-6 pt-4 pb-8 flex flex-col bg-[var(--checkout-card-bg)] rounded-bl-[var(--checkout-radius-panel)] h-fit">
            {right}
          </div>
        </div>
      </div>
    </div>
  );
}
