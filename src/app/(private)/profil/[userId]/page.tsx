"use client";

import UserProfileView from '@/sections/UserProfileView';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  return <UserProfileView userId={params.userId} />;
} 