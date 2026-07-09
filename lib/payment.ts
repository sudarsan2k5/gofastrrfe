import { apiFetch, type ApiError } from "./api";

/* ── Request/Response types ─── */

export interface InitPaymentRequest {
  checkoutSessionId: string;
  gateway: "razorpay";
  paymentMethod: "FULL" | "PARTIAL";
}

export interface InitPaymentResponse {
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  key: string;
  reused?: boolean;
}

/* ── API functions ─── */

export async function initPayment(data: InitPaymentRequest): Promise<InitPaymentResponse> {
  return apiFetch<InitPaymentResponse>("/checkout/pay/init", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ── Error mapping ─── */

export function getPaymentErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "status" in err) {
    const apiErr = err as ApiError;
    const bodyError = (apiErr.body as Record<string, unknown>)?.error;
    const status = apiErr.status;

    if (status === 400) {
      if (bodyError === "Checkout not ready for payment") {
        return "Please complete your address before payment.";
      }
      if (bodyError === "Invalid checkout totals") {
        return "Order total is invalid. Please refresh the checkout.";
      }
      return "Could not start payment. Please refresh and try again.";
    }
    if (status === 404) return "This checkout link is no longer available.";
    if (status === 500) return "Could not start payment. Please try again.";
  }

  return "Network issue. Please check your connection and try again.";
}
