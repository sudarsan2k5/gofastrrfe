"use client";

import Image from "next/image";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { type LineItem, formatPaise } from "@/lib/checkout";

const FALLBACK_IMAGE = "/products/demo-product-1.png";

interface OrderSummaryProps {
  lineItems: LineItem[];
  totals: {
    subtotalPaise: number;
    discountPaise: number;
    couponCode: string | null;
    shippingPaise: number;
    taxPaise: number;
    totalPaise: number;
  };
  currency: string;
  /** Mobile-collapsed mode: show only header row with total, hide line items */
  collapsed?: boolean;
}

export default function OrderSummary({
  lineItems,
  totals,
  currency,
  collapsed = false,
}: OrderSummaryProps) {
  const itemCount = lineItems.reduce((sum, li) => sum + li.quantity, 0);

  return (
    <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] overflow-hidden shadow-[var(--shadow-checkout-sm)]">
      {/* ── Header row ─── */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)]">
          <ShoppingCart
            className="w-[18px] h-[18px] text-[var(--checkout-heading)] flex-shrink-0"
            strokeWidth={2}
          />
          Order Summary
        </h2>

        <div className="flex items-center gap-1.5 text-sm text-[var(--checkout-muted)]">
          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          {/* On mobile-collapsed, show grand total */}
          {collapsed && (
            <span className="font-semibold text-[var(--checkout-heading)] ml-1">
              {formatPaise(totals.totalPaise, currency)}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-[var(--checkout-muted)]" />
        </div>
      </div>

      {/* ── Expanded content ─── */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {/* Line items */}
          <div className="space-y-3">
            {lineItems.map((item, idx) => (
              <div
                key={`${item.variant_id ?? "custom"}-${idx}`}
                className="flex gap-3 items-start"
              >
                {/* Product image */}
                <div className="w-[60px] h-[60px] rounded-[var(--checkout-radius-sm)] overflow-hidden bg-[var(--gf-surface-alt)] flex-shrink-0 border border-[var(--checkout-border)]">
                  <Image
                    src={item.image ?? FALLBACK_IMAGE}
                    alt={item.product_title ?? "Product"}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover"
                    unoptimized={!!item.image}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--checkout-heading)] leading-snug">
                    {item.product_title ?? "Product"}
                    {item.variant_title && (
                      <span className="font-normal text-[var(--checkout-muted)]">
                        {" "}({item.variant_title})
                      </span>
                    )}
                  </p>
                  {/* Qty — read-only, no controls */}
                  <p className="text-xs text-[var(--checkout-muted)] mt-1">
                    {item.quantity}
                  </p>
                </div>

                {/* Price column */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[var(--checkout-heading)]">
                    {formatPaise(item.unit_price_paise * item.quantity, currency)}
                  </p>
                  {item.compare_at_price_paise != null &&
                    item.compare_at_price_paise > item.unit_price_paise && (
                      <p className="text-xs text-[var(--checkout-muted)] line-through">
                        {formatPaise(
                          item.compare_at_price_paise * item.quantity,
                          currency
                        )}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-1.5 text-sm text-[var(--checkout-muted)]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[var(--checkout-body)]">
                {formatPaise(totals.subtotalPaise, currency)}
              </span>
            </div>

            {totals.discountPaise > 0 && (
              <div className="flex justify-between text-[var(--gf-success)]">
                <span>Discount on MRP</span>
                <span>-{formatPaise(totals.discountPaise, currency)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-right">
                {totals.shippingPaise > 0
                  ? formatPaise(totals.shippingPaise, currency)
                  : "Calculated at next step"}
              </span>
            </div>

            {totals.taxPaise > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPaise(totals.taxPaise, currency)}</span>
              </div>
            )}
          </div>

          {/* Grand total */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--checkout-border)]">
            <span className="text-sm font-bold text-[var(--checkout-heading)]">
              Grand Total
            </span>
            <span className="text-sm font-bold text-[var(--checkout-heading)]">
              {formatPaise(totals.totalPaise, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
