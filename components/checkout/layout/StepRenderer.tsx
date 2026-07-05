"use client";

import { CHECKOUT_STEPS } from "@/lib/checkout";
import SummaryStep from "@/components/checkout/steps/SummaryStep";
import CompletedScreen from "@/components/checkout/CompletedScreen";
import FutureStepPlaceholder from "@/components/checkout/FutureStepPlaceholder";

interface StepRendererProps {
  step: string;
  checkout: any;
}

export default function StepRenderer({ step, checkout }: StepRendererProps) {
  switch (step) {
    case CHECKOUT_STEPS.CART:
      return <SummaryStep />;
    case CHECKOUT_STEPS.COMPLETED:
      return <CompletedScreen />;
    default:
      return <FutureStepPlaceholder step={step} />;
  }
}
