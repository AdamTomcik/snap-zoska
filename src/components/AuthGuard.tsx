// src/components/AuthGuard.tsx

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Počkajte na stav session
    if (!session) {
      // Ak nie je používateľ prihlásený, presmerujte ho na prihlasovaciu stránku
      router.push("/auth/prihlasenie");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    // Ak sa stav stále načítava alebo používateľ nie je prihlásený, neukážeme deti komponentu
    return <div>Loading...</div>;
  }

  // Ak je používateľ prihlásený, renderujeme deti
  return <>{children}</>;
};

export default AuthGuard;
