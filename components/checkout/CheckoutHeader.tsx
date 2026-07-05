"use client";

import Image from "next/image";
import { X, ChevronLeft } from "lucide-react";

interface CheckoutHeaderProps {
  storeName?: string | null;
  logoUrl?: string | null;
  showClose?: boolean;
}

export default function CheckoutHeader({
  storeName,
  logoUrl,
  showClose = false,
}: CheckoutHeaderProps) {
  return (
    <header className="flex flex-col bg-[var(--checkout-card-bg)] flex-shrink-0">
      {/* Top row: Logo & Close */}
      <div className="flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile back button */}
          <button
            aria-label="Back"
            disabled
            className="md:hidden w-8 h-8 -ml-2 rounded-full flex items-center justify-center text-[var(--checkout-heading)] hover:bg-[var(--gf-surface-alt)] transition-colors cursor-not-allowed flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName ?? "Store"}
              width={28}
              height={28}
              className="rounded object-contain flex-shrink-0"
              unoptimized
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/logos/gofastrr-logo.svg"
              alt="GoFastrr"
              width={28}
              height={28}
              className="w-[28px] h-[28px] flex-shrink-0"
            />
          )}
          {storeName && (
            <span className="text-lg font-bold text-[var(--gf-primary)] truncate max-w-[150px]">
              {storeName}
            </span>
          )}
        </div>

        {/* Right: close button */}
        {showClose && (
          <button
            aria-label="Close checkout"
            disabled
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--checkout-heading)] hover:bg-[var(--gf-surface-alt)] transition-colors cursor-not-allowed flex-shrink-0"
          >
            <X className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-[var(--checkout-border)] w-full" />

      {/* Bottom row: Breadcrumbs aligned to right */}
      <div className="flex items-center justify-end px-5 md:px-6 py-3">
        <nav
          aria-label="Checkout progress"
          className="flex items-center gap-2 text-sm text-[var(--checkout-muted)] font-medium"
        >
          <span className="font-semibold text-[var(--checkout-heading)]">
            Summary
          </span>
          <span className="opacity-50" aria-hidden="true">»</span>
          <span>Address</span>
          <span className="opacity-50" aria-hidden="true">»</span>
          <span>Payment</span>
        </nav>
      </div>
    </header>
  );
}
