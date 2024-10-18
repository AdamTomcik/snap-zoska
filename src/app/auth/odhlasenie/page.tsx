"use client";

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Odhlasenie() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');  // Redirect to homepage after logout
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Odhlásenie</h1>
        <button onClick={handleLogout}>Odhlásiť sa</button>
      </div>
    </div>
  );
}
