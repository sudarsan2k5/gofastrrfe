"use client";

const BADGES = [
  {
    icon: "/icons/checkout/secured-payment.svg",
    label: "Secured Payments",
  },
  {
    icon: "/icons/checkout/cash-on-delivery.svg",
    label: "Cash on Delivery",
  },
  {
    icon: "/icons/checkout/fast-shipping.svg",
    label: "Fast Shipping",
  },
] as const;

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-8 py-5">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badge.icon}
            alt=""
            width={48}
            height={48}
            className="w-[48px] h-[48px] opacity-80"
          />
          <span className="text-xs text-[var(--checkout-muted)] text-center leading-tight">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
