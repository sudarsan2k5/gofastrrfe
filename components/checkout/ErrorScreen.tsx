"use client";

import { AlertCircle, RefreshCw, LinkIcon } from "lucide-react";

interface ErrorScreenProps {
  variant: "invalid-link" | "not-found" | "network-error";
  onRetry?: () => void;
}

const CONFIG = {
  "invalid-link": {
    icon: LinkIcon,
    title: "Invalid Checkout Link",
    description: "This checkout link is missing or malformed. Please check the URL and try again.",
    showRetry: false,
  },
  "not-found": {
    icon: AlertCircle,
    title: "Checkout Not Found",
    description: "This checkout session has expired or does not exist.",
    showRetry: false,
  },
  "network-error": {
    icon: RefreshCw,
    title: "Something Went Wrong",
    description: "We couldn\u2019t load your checkout. Please check your connection and try again.",
    showRetry: true,
  },
} as const;

export default function ErrorScreen({ variant, onRetry }: ErrorScreenProps) {
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-14 h-14 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[var(--checkout-muted)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--checkout-heading)] mb-2">
          {cfg.title}
        </h1>
        <p className="text-sm text-[var(--checkout-muted)] mb-6">
          {cfg.description}
        </p>
        {cfg.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--checkout-radius-sm)] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-sm font-medium hover:bg-[var(--checkout-primary-hover)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
