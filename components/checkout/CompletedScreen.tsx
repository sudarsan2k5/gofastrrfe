"use client";

import { CheckCircle } from "lucide-react";

/**
 * Polished order completion screen.
 * CSS-only animations: checkmark scale-in, sparkle particles, and fade-in text.
 * No backend calls, no fake order ID.
 */
export default function CompletedScreen() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-sm relative">
        {/* Sparkle particles — CSS-only celebratory effect */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="completed-sparkle completed-sparkle-1" />
          <div className="completed-sparkle completed-sparkle-2" />
          <div className="completed-sparkle completed-sparkle-3" />
          <div className="completed-sparkle completed-sparkle-4" />
          <div className="completed-sparkle completed-sparkle-5" />
          <div className="completed-sparkle completed-sparkle-6" />
        </div>

        {/* Animated check icon */}
        <div className="completed-check-container mx-auto mb-5">
          <div className="w-[72px] h-[72px] rounded-full bg-[var(--gf-primary-pale)] flex items-center justify-center completed-check-bounce">
            <div className="w-12 h-12 rounded-full bg-[var(--gf-primary)] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl font-bold text-[var(--checkout-heading)] mb-2 completed-fade-in completed-fade-in-1">
          Your order has been placed!
        </h1>

        {/* Subtext */}
        <p className="text-sm text-[var(--checkout-muted)] mb-1 completed-fade-in completed-fade-in-2">
          You will receive a confirmation shortly.
        </p>
        <p className="text-sm text-[var(--checkout-muted)] completed-fade-in completed-fade-in-3">
          Thank you for shopping with us.
        </p>

        {/* Inline styles for the animations — keeps this self-contained */}
        <style jsx>{`
          .completed-check-bounce {
            animation: checkBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .completed-fade-in {
            opacity: 0;
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .completed-fade-in-1 { animation-delay: 0.3s; }
          .completed-fade-in-2 { animation-delay: 0.45s; }
          .completed-fade-in-3 { animation-delay: 0.6s; }

          .completed-sparkle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--gf-primary-light);
            opacity: 0;
            animation: sparkleFloat 1.2s ease-out forwards;
          }
          .completed-sparkle-1 { top: 10%; left: 15%; animation-delay: 0.2s; }
          .completed-sparkle-2 { top: 5%; right: 20%; animation-delay: 0.35s; background: var(--gf-primary); }
          .completed-sparkle-3 { top: 25%; left: 5%; animation-delay: 0.5s; width: 4px; height: 4px; }
          .completed-sparkle-4 { top: 15%; right: 8%; animation-delay: 0.4s; width: 5px; height: 5px; background: var(--gf-primary-tint); }
          .completed-sparkle-5 { top: 30%; right: 15%; animation-delay: 0.55s; width: 4px; height: 4px; }
          .completed-sparkle-6 { top: 8%; left: 40%; animation-delay: 0.3s; width: 5px; height: 5px; background: var(--gf-primary); }

          @keyframes checkBounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes sparkleFloat {
            0% { opacity: 0; transform: scale(0) translateY(0); }
            30% { opacity: 0.8; transform: scale(1.2) translateY(-10px); }
            100% { opacity: 0; transform: scale(0.5) translateY(-30px); }
          }
        `}</style>
      </div>
    </div>
  );
}
