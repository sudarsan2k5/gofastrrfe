"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { checkoutDetailsSchema, type CheckoutDetails } from "@/lib/checkout";

export const checkoutDetailsQueryKey = (sessionId: string | null) => ["checkout-details", sessionId];

export function useCheckoutDetails(sessionId: string | null) {
  return useQuery<CheckoutDetails>({
    queryKey: checkoutDetailsQueryKey(sessionId),
    enabled: !!sessionId,
    queryFn: async () => {
      const raw = await apiFetch(`/checkout/details/${sessionId}`);
      return checkoutDetailsSchema.parse(raw);
    },
    refetchInterval: false,
  });
}
