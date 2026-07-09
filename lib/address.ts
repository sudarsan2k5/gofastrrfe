import { apiFetch, type ApiError } from "./api";

/* ── Request/Response types ─── */

export interface AddressData {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SaveAddressRequest {
  checkoutSessionId: string;
  email?: string;
  phone: string;
  address: AddressData;
}

export interface SaveAddressResponse {
  success: true;
}

export interface CalculateShippingRequest {
  checkoutSessionId: string;
  pincode: string;
}

export interface CalculateShippingResponse {
  shippingPaise: number;
  totalPaise: number;
}

export interface StepBackRequest {
  checkoutSessionId: string;
}

export interface StepBackResponse {
  success: true;
  step: string;
  noop?: boolean;
}

/* ── API functions ─── */

export async function saveAddress(data: SaveAddressRequest): Promise<SaveAddressResponse> {
  return apiFetch<SaveAddressResponse>("/checkout/address", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function calculateShipping(data: CalculateShippingRequest): Promise<CalculateShippingResponse> {
  return apiFetch<CalculateShippingResponse>("/checkout/shipping/calculate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function stepBack(data: StepBackRequest): Promise<StepBackResponse> {
  return apiFetch<StepBackResponse>("/checkout/step/back", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ── Error mapping ─── */

export function getAddressErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "status" in err) {
    const apiErr = err as ApiError;
    const bodyError = (apiErr.body as Record<string, unknown>)?.error;
    const status = apiErr.status;

    if (status === 400) {
      if (bodyError === "Invalid checkout state") return "Please complete the previous step first.";
      return "Please check your address details and try again.";
    }
    if (status === 404) return "This checkout link is no longer available.";
    if (status === 500) return "Could not save your address. Please try again.";
  }

  return "Network issue. Please check your connection and try again.";
}

/* ── Indian states for dropdown ─── */

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;
