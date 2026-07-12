"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useCheckoutDetails } from "@/hooks/useCheckoutDetails";
import type { ApiError } from "@/lib/api";

import CheckoutShell from "@/components/checkout/CheckoutShell";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import ErrorScreen from "@/components/checkout/ErrorScreen";
import CheckoutLayout from "@/components/checkout/layout/CheckoutLayout";
import StepRenderer from "@/components/checkout/layout/StepRenderer";

const uuidSchema = z.string().uuid();

function Spinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div className="w-6 h-6 border-2 border-[var(--checkout-primary)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--checkout-muted)]">Loading checkout...</p>
    </div>
  );
}

export default function CheckoutClient() {
  const params = useSearchParams();
  const rawSession = params.get("session");

  const sessionId = uuidSchema.safeParse(rawSession).success ? rawSession : null;
  const isInvalidLink = !rawSession || !sessionId;

  const { data, isLoading, isError, error, refetch } =
    useCheckoutDetails(sessionId);

  /* ── Invalid/missing session ─── */
  if (isInvalidLink) {
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <ErrorScreen variant="invalid-link" />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── Loading ─── */
  if (isLoading) {
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <Spinner />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  /* ── Error ─── */
  if (isError) {
    const apiErr = error as ApiError | undefined;
    const is404 = apiErr?.status === 404;
    return (
      <CheckoutShell>
        <CheckoutHeader showClose />
        <ErrorScreen
          variant={is404 ? "not-found" : "network-error"}
          onRetry={is404 ? undefined : () => refetch()}
        />
        <CheckoutFooter />
      </CheckoutShell>
    );
  }

  if (!data) return null;

  /* ── Shared Layout Render ─── */
  return (
    <CheckoutLayout checkout={data}>
      <StepRenderer step={data.step} checkout={data} />
    </CheckoutLayout>
  );
}
