import { apiFetch, type ApiError } from "./api";

export type DeliveryMode = "whatsapp" | "sms" | "failed";

export interface SendOtpRequest {
  checkoutSessionId: string;
  phone: string;
}

export interface SendOtpResponse {
  checkoutSessionId: string;
  campaignId: number;
  deliveryMode: DeliveryMode;
}

export interface ResendOtpRequest {
  checkoutSessionId: string;
}

export interface ResendOtpResponse {
  success: true;
  deliveryMode: DeliveryMode;
}

export interface VerifyOtpRequest {
  checkoutSessionId: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: true;
  checkoutSessionId: string;
  step?: "OTP_VERIFIED" | "ADDRESS_SAVED";
  previousAddresses?: unknown[];
}

export interface EditPhoneRequest {
  checkoutSessionId: string;
}

export interface EditPhoneResponse {
  success: true;
}

export async function sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
  return apiFetch<SendOtpResponse>("/auth/otp/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
  return apiFetch<ResendOtpResponse>("/auth/otp/resend", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return apiFetch<VerifyOtpResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function editPhone(data: EditPhoneRequest): Promise<EditPhoneResponse> {
  return apiFetch<EditPhoneResponse>("/auth/otp/edit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Maps backend errors to friendly UI messages.
 */
export function getFriendlyErrorMessage(err: unknown, context: "send" | "verify" | "resend" | "edit"): string {
  if (typeof err === "object" && err !== null && "status" in err) {
    const apiErr = err as ApiError;
    const bodyError = (apiErr.body as Record<string, unknown>)?.error;
    const status = apiErr.status;

    if (context === "verify") {
      if (status === 401) {
        if (bodyError === "OTP expired") return "This OTP has expired. Please request a new one.";
        return "Incorrect OTP. Please try again.";
      }
      if (status === 429) {
        if (bodyError === "Too many attempts") return "Too many incorrect attempts. Please request a new OTP.";
        return "Too many requests. Please wait before trying again.";
      }
      if (status === 404) return "This checkout link is no longer available.";
      if (status === 503) return "Temporary issue. Please try again.";
      return "Could not verify OTP. Please try again.";
    }

    if (context === "send") {
      if (status === 429) return "Too many attempts. Please wait and try again.";
      if (status === 400) return "Please enter a valid mobile number.";
      if (status === 404) return "This checkout link is no longer available.";
      if (status === 500) return "Could not send OTP. Please try again.";
      return "Network issue. Please check your connection and try again.";
    }

    if (context === "resend") {
      if (status === 429) return "Too many attempts. Please wait before resending.";
      if (status === 400) return "Please edit your number and try again.";
      if (status === 404) return "This checkout link is no longer available.";
      return "Could not resend OTP. Please try again.";
    }

    if (context === "edit") {
      return "Could not update your number. Please try again.";
    }
  }

  // Network / unknown errors
  if (context === "verify") return "Could not verify OTP. Please try again.";
  if (context === "send") return "Network issue. Please check your connection and try again.";
  if (context === "resend") return "Could not resend OTP. Please try again.";
  return "Could not update your number. Please try again.";
}
