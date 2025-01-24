// src/app/auth/odhlasenie/page.tsx

"use client";

import { signOut } from "next-auth/react";
//import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Odhlasenie() {
  //const router = useRouter();

  // Funkcia na odhlásenie
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });  // Odhlásenie a presmerovanie na domovskú stránku
  };

  // Tento useEffect zabezpečí, že ak sa komponenta načíta a používateľ je odhlásený, automaticky sa presmeruje.
  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Odhlásenie</h1>
        <p>Ste úspešne odhlásený, presmerovávame vás na domovskú stránku...</p>
      </div>
    </div>
  );
}
