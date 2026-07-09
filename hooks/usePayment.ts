import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutDetailsQueryKey } from "./useCheckoutDetails";
import { initPayment, type InitPaymentRequest } from "@/lib/payment";

export function useInitPayment(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentMethod: InitPaymentRequest["paymentMethod"]) =>
      initPayment({ checkoutSessionId: sessionId, gateway: "razorpay", paymentMethod }),
    onSuccess: () => {
      // Intentionally not invalidating checkout-details here.
      // Payment init advances step to PAYMENT_INITIATED on the backend.
      // We will invalidate checkout-details separately when polling starts.
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}
