"use client";

/**
 * Coupon card — visual placeholder only in F1.
 * No coupon API calls, Apply button is disabled.
 */
export default function CouponCardPlaceholder() {
  return (
    <div className="bg-[var(--gf-primary-pale)] border border-[var(--gf-primary-tint)] rounded-[var(--checkout-radius-md)] px-4 py-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[var(--gf-primary)] flex items-center justify-center flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/checkout/coupon.svg"
          alt=""
          width={24}
          height={24}
          className="w-[24px] h-[24px]"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--gf-primary)]">
          Save on this order
        </p>
        <p className="text-xs text-[var(--checkout-muted)]">
          View all coupons &rsaquo;
        </p>
      </div>

      {/* Disabled Apply button */}
      <button
        disabled
        className="text-sm font-semibold text-[var(--gf-primary)] opacity-40 cursor-not-allowed"
      >
        Apply
      </button>
    </div>
  );
}
