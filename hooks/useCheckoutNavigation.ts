import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stepBack } from "@/lib/checkout";
import { checkoutDetailsQueryKey } from "./useCheckoutDetails";

export function useStepBack(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stepBack(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}
