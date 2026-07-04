"use client";

import Image from "next/image";
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
}

export default function OrderSummary({
  lineItems,
  totals,
  currency,
}: OrderSummaryProps) {
  const itemCount = lineItems.reduce((sum, li) => sum + li.quantity, 0);

  return (
    <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-5 shadow-[var(--shadow-checkout-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--checkout-heading)] flex items-center gap-2">
          <span className="text-base">🛒</span>
          Order Summary
        </h2>
        <span className="text-sm text-[var(--checkout-muted)]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Line items */}
      <div className="space-y-4">
        {lineItems.map((item, idx) => (
          <div
            key={`${item.variant_id ?? "custom"}-${idx}`}
            className="flex gap-3"
          >
            {/* Product image */}
            <div className="w-16 h-16 rounded-[var(--checkout-radius-sm)] overflow-hidden bg-[var(--gf-surface-alt)] flex-shrink-0">
              <Image
                src={item.image ?? FALLBACK_IMAGE}
                alt={item.product_title ?? "Product"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized={!!item.image} // External URLs bypass optimization
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--checkout-heading)] truncate">
                {item.product_title ?? "Product"}
              </p>
              {item.variant_title && (
                <p className="text-xs text-[var(--checkout-muted)]">
                  {item.variant_title}
                </p>
              )}
              <p className="text-xs text-[var(--checkout-muted)] mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>

            {/* Price */}
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

      {/* Divider */}
      <hr className="my-4 border-[var(--checkout-border)]" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--checkout-body)]">
          <span>Subtotal</span>
          <span>{formatPaise(totals.subtotalPaise, currency)}</span>
        </div>

        {totals.discountPaise > 0 && (
          <div className="flex justify-between text-[var(--gf-success)]">
            <span>Discount on MRP</span>
            <span>-{formatPaise(totals.discountPaise, currency)}</span>
          </div>
        )}

        <div className="flex justify-between text-[var(--checkout-muted)]">
          <span>Shipping</span>
          <span>
            {totals.shippingPaise > 0
              ? formatPaise(totals.shippingPaise, currency)
              : "Calculated at next step"}
          </span>
        </div>

        {totals.taxPaise > 0 && (
          <div className="flex justify-between text-[var(--checkout-muted)]">
            <span>Tax</span>
            <span>{formatPaise(totals.taxPaise, currency)}</span>
          </div>
        )}
      </div>

      {/* Grand total */}
      <hr className="my-3 border-[var(--checkout-border)]" />
      <div className="flex justify-between items-center">
        <span className="text-base font-bold text-[var(--checkout-heading)]">
          Grand Total
        </span>
        <span className="text-base font-bold text-[var(--checkout-heading)]">
          {formatPaise(totals.totalPaise, currency)}
        </span>
      </div>
    </div>
  );
}
