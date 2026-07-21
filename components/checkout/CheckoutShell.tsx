"use client";

import type { ReactNode } from "react";

interface CheckoutShellProps {
  children: ReactNode;
}

/**
 * Responsive shell for the GoFastrr checkout.
 *
 * Desktop/Tablet (≥768px):
 *   - Simulated faded merchant-site background (dev-only visual chrome).
 *   - Dark backdrop-blur overlay.
 *   - Centered checkout panel with controlled size, outer radius, and shadow.
 *
 * Mobile (<768px):
 *   - No overlay. Full-screen single-column checkout (100vw × 100dvh).
 *
 * In production the embed script supplies the real merchant page behind
 * and renders this content inside an iframe.
 */
export default function CheckoutShell({ children }: CheckoutShellProps) {
  return (
    <>
      {/* ── DESKTOP / TABLET: fixed overlay + centered panel ─── */}
      <div
        className="hidden md:flex fixed inset-0 z-40 items-center justify-center overflow-hidden"
        style={{
          background: "var(--checkout-overlay-bg)",
          backdropFilter: `blur(var(--checkout-overlay-blur))`,
          WebkitBackdropFilter: `blur(var(--checkout-overlay-blur))`,
        }}
      >
        {/* Simulated merchant-site background — dev preview only */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #0f1923 0%, #1a2e24 40%, #0e1a28 100%)",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 35%, #0B7E63 0%, transparent 50%),
                                radial-gradient(circle at 75% 65%, #12A882 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* ── Checkout Panel ─── */}
        <div
          className="relative z-50 flex flex-col overflow-hidden h-[min(860px,calc(100dvh-32px))] min-h-[min(720px,calc(100dvh-32px))] max-h-[calc(100dvh-32px)]"
          style={{
            width: "var(--checkout-panel-w)",
            borderRadius: "var(--checkout-radius-panel)",
            background: "var(--gf-surface-alt)",
            boxShadow:
              "0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          {children}
        </div>
      </div>

      {/* ── MOBILE: full-screen normal flow ─── */}
      <div
        className="flex md:hidden flex-col min-h-dvh w-screen bg-[var(--checkout-page-bg)] overflow-x-hidden"
      >
        {children}
      </div>
    </>
  );
}
