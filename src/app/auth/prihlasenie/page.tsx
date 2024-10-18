"use client";

import { signIn } from 'next-auth/react';

export default function Prihlasenie() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Prihlásenie</h1>
        <button onClick={() => signIn('google')}>Prihlásiť sa cez Google</button>
      </div>
    </div>
  );
}
