"use client";

export default function CheckoutFooter() {
  return (
    <footer className="py-4 flex items-center justify-center gap-1.5 opacity-60">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/powered-by-gofastrr.svg"
        alt="Powered by GoFastrr"
        width={130}
        height={16}
        className="w-[130px] h-[16px]"
      />
    </footer>
  );
}
