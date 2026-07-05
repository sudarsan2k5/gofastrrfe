"use client";

/**
 * Coupon card — visual placeholder only in F1.
 * Matches Figma: green-tinted bg, dark-green icon box, bold primary text,
 * muted secondary link, right-aligned green Apply button.
 * No coupon API calls. Apply is non-functional.
 */
export default function CouponCardPlaceholder() {
  return (
    <div className="bg-[#3C7E44]/10 border border-[#3C7E44]/20 rounded-[var(--checkout-radius-md)] px-4 py-2.5 flex items-center gap-3">
      {/* Icon box */}
      <div className="w-8 h-8 rounded-xl bg-[#3C7E44] flex items-center justify-center flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/checkout/coupon.svg"
          alt=""
          width={16}
          height={16}
          className="w-4 h-4"
        />
      </div>

      {/* Text stack */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#3C7E44] leading-tight">
          Save on this order
        </p>
        <p className="text-xs text-[var(--checkout-muted)] mt-0.5">
          View all coupons{" "}
          <span className="text-[var(--checkout-muted)]">›</span>
        </p>
      </div>

      {/* Apply — non-functional */}
      <button
        disabled
        className="text-sm font-semibold text-[#3C7E44] cursor-not-allowed flex-shrink-0"
      >
        Apply
      </button>
    </div>
  );
}
