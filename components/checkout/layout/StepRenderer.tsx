"use client";

import { CHECKOUT_STEPS } from "@/lib/checkout";
import SummaryStep from "@/components/checkout/steps/SummaryStep";
import OtpStep from "@/components/checkout/steps/OtpStep";
import CompletedScreen from "@/components/checkout/CompletedScreen";
import FutureStepPlaceholder from "@/components/checkout/FutureStepPlaceholder";
import { type CheckoutDetails } from "@/lib/checkout";

interface StepRendererProps {
  step: string;
  checkout: CheckoutDetails;
}

export default function StepRenderer({ step, checkout }: StepRendererProps) {
  switch (step) {
    case CHECKOUT_STEPS.CART:
      return <SummaryStep checkout={checkout} />;
    case CHECKOUT_STEPS.OTP_SENT:
      return <OtpStep checkout={checkout} />;
    case CHECKOUT_STEPS.OTP_VERIFIED:
    case CHECKOUT_STEPS.ADDRESS_SAVED:
      return <FutureStepPlaceholder step="Address" />;
    case CHECKOUT_STEPS.COMPLETED:
      return <CompletedScreen />;
    default:
      return <FutureStepPlaceholder step={step} />;
  }
}
