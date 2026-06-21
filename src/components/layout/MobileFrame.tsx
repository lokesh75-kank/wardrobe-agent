import type { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFE3E3] text-zinc-900 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-[#FFE3E3]">
        {children}
      </div>
    </div>
  );
}
