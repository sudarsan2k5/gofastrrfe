"use client";

import { ThumbsUp, ChevronDown } from "lucide-react";

/**
 * "You may also like" upsell section — visual placeholder only.
 * No upsell or cart API calls. All Add actions are non-functional.
 * Matches Figma: white card, thumbsup icon, horizontal scroll cards.
 */
export default function UpsellPlaceholder() {
  return (
    <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] overflow-hidden shadow-[var(--shadow-checkout-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-[var(--checkout-heading)] flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-[var(--checkout-muted)]" strokeWidth={2} />
          You may also like
        </h3>
        <ChevronDown className="w-4 h-4 text-[var(--checkout-muted)]" />
      </div>

      {/* Scrollable cards */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-none">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="w-[140px] flex-shrink-0 rounded-[var(--checkout-radius-sm)] border border-[var(--checkout-border)] p-2.5"
          >
            {/* Product image placeholder */}
            <div className="w-full h-[72px] bg-[var(--gf-surface-alt)] rounded-md mb-2" />

            {/* Title skeleton lines */}
            <div className="text-xs text-[var(--checkout-heading)] font-medium leading-tight mb-0.5 truncate">
              Short Sleeve T-shirt
            </div>
            <div className="text-xs text-[var(--checkout-muted)] mb-1">(M)</div>

            {/* Prices */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xs font-semibold text-[var(--checkout-heading)]">₹3200</span>
              <span className="text-[10px] text-[var(--checkout-muted)] line-through">₹3400</span>
            </div>

            {/* Add button */}
            <button
              disabled
              className="w-full text-xs py-1 rounded-[var(--checkout-radius-sm)] border border-[var(--checkout-border)] text-[var(--checkout-muted)] cursor-not-allowed"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
