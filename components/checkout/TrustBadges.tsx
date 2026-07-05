"use client";

const BADGES = [
  { icon: "/icons/checkout/secured-payment.svg", label: "Secured Payments" },
  { icon: "/icons/checkout/cash-on-delivery.svg", label: "Cash on Delivery" },
  { icon: "/icons/checkout/fast-shipping.svg", label: "Fast Shipping" },
] as const;

/**
 * Trust badges row matching Figma: circular grey bg around each icon,
 * label text below, three balanced columns.
 */
export default function TrustBadges() {
  return (
    <div className="flex items-start justify-center gap-10 md:gap-14 py-6">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-2">
          {/* Circular grey container */}
          <div className="w-11 h-11 rounded-full bg-[var(--gf-surface-alt)] border border-[var(--checkout-border)] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badge.icon}
              alt=""
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <span className="text-[10px] text-[var(--checkout-muted)] text-center leading-tight whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
