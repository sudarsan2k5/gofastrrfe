import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutDetailsQueryKey } from "./useCheckoutDetails";
import {
  sendOtp,
  resendOtp,
  verifyOtp,
  editPhone,
  type DeliveryMode,
} from "@/lib/auth";

export type OtpDeliveryUiState = {
  deliveryMode: DeliveryMode | null;
  sentAt: number | null;
};

const getOtpUiStorageKey = (sessionId: string) => `gofastrr:otp-delivery:${sessionId}`;

export function getOtpDeliveryUiState(sessionId: string): OtpDeliveryUiState {
  if (typeof window === "undefined") return { deliveryMode: null, sentAt: null };
  const raw = sessionStorage.getItem(getOtpUiStorageKey(sessionId));
  if (!raw) return { deliveryMode: null, sentAt: null };
  try {
    return JSON.parse(raw) as OtpDeliveryUiState;
  } catch {
    return { deliveryMode: null, sentAt: null };
  }
}

export function setOtpDeliveryUiState(sessionId: string, state: OtpDeliveryUiState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(getOtpUiStorageKey(sessionId), JSON.stringify(state));
}

export function clearOtpDeliveryUiState(sessionId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(getOtpUiStorageKey(sessionId));
}

export function useSendOtp(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phone: string) => sendOtp({ checkoutSessionId: sessionId, phone }),
    onSuccess: (data) => {
      setOtpDeliveryUiState(sessionId, {
        deliveryMode: data.deliveryMode,
        sentAt: Date.now(),
      });
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}

export function useResendOtp(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => resendOtp({ checkoutSessionId: sessionId }),
    onSuccess: (data) => {
      setOtpDeliveryUiState(sessionId, {
        deliveryMode: data.deliveryMode,
        sentAt: Date.now(),
      });
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}

export function useVerifyOtp(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (otp: string) => verifyOtp({ checkoutSessionId: sessionId, otp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
    retry: (failureCount, error: unknown) => {
      // Retry exactly once on 503
      if ((error as { status?: number })?.status === 503 && failureCount < 1) return true;
      return false;
    },
  });
}

export function useEditPhone(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => editPhone({ checkoutSessionId: sessionId }),
    onSuccess: () => {
      clearOtpDeliveryUiState(sessionId);
      queryClient.invalidateQueries({ queryKey: checkoutDetailsQueryKey(sessionId) });
    },
  });
}
