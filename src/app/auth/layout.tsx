// src/app/auth/layout.tsx

"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Tu môžeme pridať akýkoľvek layout pre autentifikáciu */}
      {children}
    </div>
  );
}
