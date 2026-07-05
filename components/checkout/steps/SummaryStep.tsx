"use client";

import { Phone } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";

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
        Notify me about offers & updates
      </label>
    </div>
  );
}

export default function SummaryStep() {
  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <ContactDetailsCard />
        <TrustBadges />
      </div>

      {/* Single Unified CTA */}
      <div className="mt-auto md:mt-16 lg:mt-24 sticky md:static bottom-0 -mx-4 md:mx-0 px-4 md:px-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0 md:pt-0 bg-[var(--checkout-card-bg)] md:bg-transparent z-10 flex justify-end">
        <button
          disabled
          className="w-full md:w-[160px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base md:text-sm font-semibold cursor-not-allowed opacity-60 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
