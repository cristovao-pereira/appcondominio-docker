"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
