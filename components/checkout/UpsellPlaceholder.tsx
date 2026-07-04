"use client";

import { ThumbsUp, ChevronDown } from "lucide-react";

/**
 * "You may also like" section — visual placeholder only in F1.
 * No upsell API calls, Add buttons are disabled.
 */
export default function UpsellPlaceholder() {
  return (
    <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-5 shadow-[var(--shadow-checkout-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--checkout-heading)] flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-[var(--checkout-muted)]" />
          You may also like
        </h3>
        <ChevronDown className="w-4 h-4 text-[var(--checkout-muted)]" />
      </div>

      {/* Placeholder cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="min-w-[160px] flex-shrink-0 rounded-[var(--checkout-radius-sm)] border border-[var(--checkout-border)] p-3 opacity-50"
          >
            <div className="w-full h-16 bg-[var(--gf-surface-alt)] rounded-md mb-2" />
            <div className="h-3 bg-[var(--gf-surface-alt)] rounded w-3/4 mb-1" />
            <div className="h-3 bg-[var(--gf-surface-alt)] rounded w-1/2 mb-2" />
            <button
              disabled
              className="w-full text-xs py-1.5 rounded-[var(--checkout-radius-sm)] border border-[var(--checkout-border)] text-[var(--checkout-muted)] cursor-not-allowed"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
