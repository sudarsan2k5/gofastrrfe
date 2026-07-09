"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import TrustBadges from "@/components/checkout/TrustBadges";
import { useSaveAddress, useCalculateShipping } from "@/hooks/useAddress";
import { getAddressErrorMessage, INDIAN_STATES } from "@/lib/address";
import { type CheckoutDetails } from "@/lib/checkout";

interface AddressStepProps {
  checkout: CheckoutDetails;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
}

type FieldKey = keyof FormData;


function validate(form: FormData, hasPhone: boolean) {
  const errors: Partial<Record<FieldKey | "phone", string>> = {};
  if (!form.firstName.trim()) errors.firstName = "Enter first name";
  if (!form.lastName.trim()) errors.lastName = "Enter last name";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email";
  if (!form.line1.trim()) errors.line1 = "Enter complete address";
  if (!form.city.trim()) errors.city = "Enter city";
  if (!form.state.trim()) errors.state = "Enter state";
  if (!/^\d{6}$/.test(form.postalCode.trim())) errors.postalCode = "Enter a valid 6-digit pincode";
  if (!hasPhone) errors.phone = "Please verify your phone number again";
  return errors;
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return "****";
  return `${phone.slice(0, 2)}${"*".repeat(phone.length - 4)}${phone.slice(-2)}`;
}

export default function AddressStep({ checkout }: AddressStepProps) {
  const sessionId = checkout.checkoutSessionId;

  // Prefill from existing data
  const initialForm: FormData = {
    firstName: checkout.shippingAddress?.firstName ?? "",
    lastName: checkout.shippingAddress?.lastName ?? "",
    email: checkout.email ?? "",
    line1: checkout.shippingAddress?.line1 ?? "",
    city: checkout.shippingAddress?.city ?? "",
    state: checkout.shippingAddress?.state ?? "",
    postalCode: checkout.shippingAddress?.postalCode ?? "",
  };

  const [form, setForm] = useState<FormData>(initialForm);
  const [touchedFields, setTouchedFields] = useState<Set<FieldKey>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [shippingStatus, setShippingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { mutate: saveAddr, isPending: isSaving, error: saveError } = useSaveAddress(sessionId);
  const { mutate: calcShipping } = useCalculateShipping(sessionId);

  // Debounce timer for shipping calculation
  const shippingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCalcPincodeRef = useRef<string>("");

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (shippingTimerRef.current) clearTimeout(shippingTimerRef.current);
    };
  }, []);

  const triggerShippingCalc = useCallback(
    (pincode: string) => {
      if (shippingTimerRef.current) clearTimeout(shippingTimerRef.current);

      if (!/^\d{6}$/.test(pincode)) {
        setShippingStatus("idle");
        return;
      }

      if (pincode === lastCalcPincodeRef.current) return;

      setShippingStatus("loading");

      shippingTimerRef.current = setTimeout(() => {
        lastCalcPincodeRef.current = pincode;
        calcShipping(pincode, {
          onSuccess: () => setShippingStatus("success"),
          onError: () => setShippingStatus("error"),
        });
      }, 400);
    },
    [calcShipping]
  );

  const updateField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "postalCode") {
      triggerShippingCalc(value.replace(/\D/g, "").slice(0, 6));
    }
  };

  const handleBlur = (key: FieldKey) => {
    setTouchedFields((prev) => new Set(prev).add(key));
  };

  const errors = validate(form, !!checkout.phone);
  const hasErrors = Object.keys(errors).length > 0;

  const shouldShowError = (key: FieldKey): boolean => {
    return submitAttempted || touchedFields.has(key);
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (hasErrors) return;

    saveAddr({
      email: form.email.trim(),
      phone: checkout.phone ?? "",
      address: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        line1: form.line1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: "IN",
      },
    });
  };

  const apiErrorMessage = saveError ? getAddressErrorMessage(saveError) : null;

  /* ── Shared input class ─── */
  const inputBase =
    "w-full px-3 py-2.5 text-sm text-[var(--checkout-heading)] bg-transparent border rounded-[var(--checkout-radius-sm)] outline-none transition-all placeholder:text-[var(--checkout-muted)] disabled:opacity-50";
  const inputNormal = `${inputBase} border-[var(--checkout-border)] focus:border-[var(--checkout-primary)] focus:ring-1 focus:ring-[var(--checkout-primary)]`;
  const inputError = `${inputBase} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500`;

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="space-y-3 md:space-y-4 pb-6 md:pb-0">
        <div className="bg-[var(--checkout-card-bg)] rounded-[var(--checkout-radius-md)] border border-[var(--checkout-border)] p-4 shadow-[var(--shadow-checkout-sm)]">
          {/* Title */}
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--checkout-heading)] mb-1">
            <span className="w-7 h-7 rounded-full bg-[var(--gf-surface-alt)] flex items-center justify-center flex-shrink-0">
              <Image src="/icons/checkout/delivery_address.svg" alt="" width={16} height={16} />
            </span>
            Delivery Address
          </h2>
          <p className="text-xs text-[var(--checkout-muted)] mb-4 ml-9">
            Add your address to calculate delivery and continue to payment.
          </p>

          {/* Phone read-only */}
          {checkout.phone && (
            <p className="text-xs text-[var(--checkout-body)] mb-4 ml-0.5">
              Delivering to{" "}
              <span className="font-medium text-[var(--checkout-heading)]">
                +91 {maskPhone(checkout.phone)}
              </span>
            </p>
          )}

          {/* Form */}
          <div className="space-y-3">
            {/* First name + Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  disabled={isSaving}
                  className={shouldShowError("firstName") && errors.firstName ? inputError : inputNormal}
                />
                {shouldShowError("firstName") && errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  disabled={isSaving}
                  className={shouldShowError("lastName") && errors.lastName ? inputError : inputNormal}
                />
                {shouldShowError("lastName") && errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                disabled={isSaving}
                className={shouldShowError("email") && errors.email ? inputError : inputNormal}
              />
              {shouldShowError("email") && errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
                value={form.postalCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  updateField("postalCode", val);
                }}
                onBlur={() => handleBlur("postalCode")}
                disabled={isSaving}
                className={shouldShowError("postalCode") && errors.postalCode ? inputError : inputNormal}
              />
              {shouldShowError("postalCode") && errors.postalCode && (
                <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
              )}
              {shippingStatus === "loading" && (
                <p className="mt-1 text-xs text-[var(--checkout-muted)]">Calculating delivery charges...</p>
              )}
              {shippingStatus === "success" && (
                <p className="mt-1 text-xs text-green-600">Delivery charges updated</p>
              )}
              {shippingStatus === "error" && (
                <p className="mt-1 text-xs text-amber-600">
                  Could not calculate delivery charges. You can still continue.
                </p>
              )}
            </div>

            {/* Address line1 */}
            <div>
              <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="House no., building, street, landmark"
                value={form.line1}
                onChange={(e) => updateField("line1", e.target.value)}
                onBlur={() => handleBlur("line1")}
                disabled={isSaving}
                className={shouldShowError("line1") && errors.line1 ? inputError : inputNormal}
              />
              {shouldShowError("line1") && errors.line1 && (
                <p className="mt-1 text-xs text-red-500">{errors.line1}</p>
              )}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  disabled={isSaving}
                  className={shouldShowError("city") && errors.city ? inputError : inputNormal}
                />
                {shouldShowError("city") && errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--checkout-body)] mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  onBlur={() => handleBlur("state")}
                  disabled={isSaving}
                  className={`${shouldShowError("state") && errors.state ? inputError : inputNormal} appearance-none bg-[var(--checkout-card-bg)]`}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {shouldShowError("state") && errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>
            </div>
          </div>

          {/* API error */}
          {apiErrorMessage && (
            <div className="mt-3 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{apiErrorMessage}</span>
            </div>
          )}
        </div>

        <TrustBadges />
      </div>

      {/* Sticky CTA */}
      <div className="mt-auto md:mt-16 lg:mt-24 sticky md:static bottom-0 -mx-4 md:mx-0 px-4 md:px-0 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0 md:pt-0 bg-[var(--checkout-card-bg)] md:bg-transparent z-10 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full md:w-[160px] h-[58px] md:h-auto md:py-3.5 rounded-[8px] bg-[var(--checkout-primary)] text-[var(--checkout-button-text)] text-base md:text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving address..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
