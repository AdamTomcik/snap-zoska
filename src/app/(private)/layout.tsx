// src/app/(private)/layout.tsx

"use client";

import { ReactNode } from "react";
import AuthGuard from "../../components/AuthGuard";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div>{children}</div>
    </AuthGuard>
  );
}
