"use client";

import Image from "next/image";
import { ArrowLeft, Search, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

/**
 * "Coupons for you" panel — demo placeholder only.
 * Replaces left sidebar content when opened from the coupon card.
 * No real coupon logic. Apply does not change totals.
 */

interface CouponsPanelProps {
  onBack: () => void;
}

/* ── Demo coupon data ── */

interface DemoCoupon {
  id: string;
  title: string;
  savingsText: string | null;
  pill: string;
  pillColor: "green" | "blue";
  applicable: boolean;
  errorText: string | null;
  details: string[];
}

const DEMO_COUPONS: DemoCoupon[] = [
  {
    id: "FIRSTTIME",
    title: "Flat 5% off",
    savingsText: "Save ₹64 on this order",
    pill: "FIRST TIME",
    pillColor: "green",
    applicable: true,
    errorText: null,
    details: [
      "Flat 5% off on the total order value",
      "Applicable only on your first order",
      "Applicable once per user",
    ],
  },
  {
    id: "BUYXGETY",
    title: "Flat 5% off",
    savingsText: null,
    pill: "Buy X Get Y",
    pillColor: "blue",
    applicable: false,
    errorText: "This coupon is not applicable",
    details: [
      "Buy 2 items and get 1 free",
      "Maximum discount ₹500",
      "Cannot be combined with other offers",
    ],
  },
];

export default function CouponsPanel({ onBack }: CouponsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(DEMO_COUPONS[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3 min-w-0 w-full max-w-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 py-1">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[var(--gf-surface-alt)] border border-[var(--checkout-border)] flex items-center justify-center flex-shrink-0 hover:bg-[var(--checkout-border)] active:scale-95 transition-all"
          aria-label="Back to order summary"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--checkout-heading)]" />
        </button>
        <h2 className="text-base font-semibold text-[var(--checkout-heading)]">
          Coupons for you
        </h2>
      </div>

      {/* ── Coupon code input (non-functional) ── */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-[var(--checkout-muted)]" />
        </div>
        <input
          type="text"
          placeholder="Enter coupon code"
          disabled
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--gf-surface-alt)] border border-[var(--checkout-border)] rounded-[var(--checkout-radius-sm)] text-[var(--checkout-heading)] placeholder:text-[var(--checkout-muted)] cursor-not-allowed opacity-80 outline-none"
        />
      </div>

      {/* ── Coupon cards ── */}
      <div className="space-y-3">
        {DEMO_COUPONS.map((coupon, idx) => {
          const isExpanded = expandedId === coupon.id;
          const isFirst = idx === 0;

          return (
            <div key={coupon.id}>
              {/* Divider before non-first coupons */}
              {!isFirst && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-[var(--checkout-border)]" />
                  <span className="text-[10px] font-semibold text-[var(--checkout-muted)] tracking-wider uppercase">
                    Other Coupons
                  </span>
                  <div className="flex-1 h-px bg-[var(--checkout-border)]" />
                </div>
              )}

              {/* Coupon card */}
              <div
                className={`
                  rounded-[var(--checkout-radius-md)] border overflow-hidden
                  ${coupon.applicable
                    ? "border-[var(--checkout-primary-tint)] bg-[var(--checkout-card-bg)]"
                    : "border-[var(--checkout-border)] bg-[var(--checkout-card-bg)]"
                  }
                `}
              >
                {/* Card body */}
                <div className="p-3.5">
                  <div className="flex items-start gap-3">
                    {/* Coupon icon */}
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        ${coupon.applicable
                          ? "bg-[var(--checkout-primary-pale)]"
                          : "bg-[var(--gf-surface-alt)]"
                        }
                      `}
                    >
                      <Tag
                        className={`w-4 h-4 ${
                          coupon.applicable
                            ? "text-[var(--checkout-primary)]"
                            : "text-[var(--checkout-muted)]"
                        }`}
                      />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[var(--checkout-heading)]">
                          {coupon.title}
                        </p>
                        <span
                          className={`
                            px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase
                            ${coupon.pillColor === "green"
                              ? "bg-[color-mix(in_srgb,var(--checkout-primary)_12%,transparent)] text-[var(--checkout-primary)]"
                              : "bg-blue-50 text-blue-600"
                            }
                          `}
                        >
                          {coupon.pill}
                        </span>
                      </div>

                      {coupon.savingsText && (
                        <p className="text-xs text-[var(--checkout-primary)] font-medium mt-0.5">
                          {coupon.savingsText}
                        </p>
                      )}

                      {coupon.errorText && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {coupon.errorText}
                        </p>
                      )}
                    </div>

                    {/* Right action */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {coupon.applicable ? (
                        <button
                          disabled
                          className="text-xs font-bold text-[var(--checkout-primary)] opacity-70 cursor-not-allowed uppercase tracking-wide"
                        >
                          Apply
                        </button>
                      ) : (
                        <Image
                          src="/icons/checkout/coupon.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="opacity-40"
                        />
                      )}
                    </div>
                  </div>

                  {/* View Details toggle */}
                  <button
                    onClick={() => toggleExpand(coupon.id)}
                    className="flex items-center gap-1 text-[11px] font-medium text-[var(--checkout-primary)] mt-2 ml-12 hover:underline transition-colors"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Expandable details */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-0">
                    <div className="bg-[var(--gf-surface-alt)] rounded-[var(--checkout-radius-sm)] p-3 border border-[var(--checkout-border)]">
                      <ul className="space-y-1.5">
                        {coupon.details.map((detail, di) => (
                          <li
                            key={di}
                            className="flex items-start gap-2 text-xs text-[var(--checkout-body)]"
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--checkout-muted)] mt-1.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
