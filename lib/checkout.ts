import { z } from "zod";

/* ── Response schema from GET /checkout/details/:id ─── */

export const lineItemSchema = z.object({
  variant_id: z.number().nullable(),
  quantity: z.number(),
  unit_price_paise: z.union([z.number(), z.string()]).transform(Number),
  compare_at_price_paise: z
    .union([z.number(), z.string()])
    .nullable()
    .transform((v) => (v != null ? Number(v) : null)),
  product_title: z.string().nullable(),
  variant_title: z.string().nullable(),
  image: z.string().nullable(),
});

export const totalsSchema = z.object({
  subtotalPaise: z.number(),
  discountPaise: z.number(),
  couponCode: z.string().nullable(),
  shippingPaise: z.number(),
  taxPaise: z.number(),
  totalPaise: z.number(),
});

export const brandingSchema = z.object({
  storeName: z.string().nullable(),
  logoUrl: z.string().nullable(),
});

export const addressSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    line1: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  })
  .nullable();

export const checkoutDetailsSchema = z.object({
  checkoutSessionId: z.string().uuid(),
  step: z.string(),
  currency: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  shippingAddress: addressSchema,
  totals: totalsSchema,
  lineItems: z.array(lineItemSchema),
  branding: brandingSchema,
});

export type CheckoutDetails = z.infer<typeof checkoutDetailsSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type Totals = z.infer<typeof totalsSchema>;
export type Branding = z.infer<typeof brandingSchema>;

/* ── Checkout steps (mirrors backend CheckoutStep enum) ─── */

export const CHECKOUT_STEPS = {
  CART: "CART",
  OTP_SENT: "OTP_SENT",
  OTP_VERIFIED: "OTP_VERIFIED",
  ADDRESS_SAVED: "ADDRESS_SAVED",
  PAYMENT_READY: "PAYMENT_READY",
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  COMPLETED: "COMPLETED",
} as const;

/* ── Formatting helpers ─── */

export function formatPaise(paise: number, currency = "INR"): string {
  const rupees = paise / 100;
  if (currency === "INR") {
    return `₹${rupees.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(rupees);
}
