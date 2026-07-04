"use client";

import Image from "next/image";

interface CheckoutHeaderProps {
  storeName?: string | null;
  logoUrl?: string | null;
}

export default function CheckoutHeader({
  storeName,
  logoUrl,
}: CheckoutHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[var(--checkout-card-bg)] border-b border-[var(--checkout-border)]">
      {/* Left: merchant logo or GoFastrr logo */}
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={storeName ?? "Store"}
            width={32}
            height={32}
            className="rounded"
            unoptimized
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/logos/gofastrr-logo.svg"
            alt="GoFastrr Logo"
            width={28}
            height={28}
            className="w-[28px] h-[28px]"
          />
        )}
        {storeName && (
          <span className="text-sm font-medium text-[var(--checkout-heading)]">
            {storeName}
          </span>
        )}
      </div>

      {/* Right: step breadcrumb (visual only in F1) */}
      <nav className="hidden sm:flex items-center gap-1 text-xs text-[var(--checkout-muted)]">
        <span className="font-semibold text-[var(--checkout-heading)]">
          Summary
        </span>
        <span>»</span>
        <span>Address</span>
        <span>»</span>
        <span>Payment</span>
      </nav>
    </header>
  );
}
