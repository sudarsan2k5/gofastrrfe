import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutDetailsQueryKey } from "./useCheckoutDetails";
import {
  saveAddress,
  calculateShipping,
  type AddressData,
} from "@/lib/address";

export function useSaveAddress(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email?: string; phone: string; address: AddressData }) =>
      saveAddress({ checkoutSessionId: sessionId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}

export function useCalculateShipping(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pincode: string) =>
      calculateShipping({ checkoutSessionId: sessionId, pincode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}
