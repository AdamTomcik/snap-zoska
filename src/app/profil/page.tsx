"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/prihlasenie');
    return null;
  }

  return (
    <div>
      <h1>Profil</h1>
      <p>Si prihlásený ako {session.user?.name}</p>
    </div>
  );
}
