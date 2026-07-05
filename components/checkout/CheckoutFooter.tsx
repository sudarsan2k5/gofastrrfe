"use client";

export default function CheckoutFooter() {
  return (
    <footer className="flex-shrink-0 py-2.5 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/powered-by-gofastrr.svg"
        alt="Powered by GoFastrr"
        width={120}
        height={14}
        className="w-[120px] h-[14px] opacity-50"
      />
    </footer>
  );
}
