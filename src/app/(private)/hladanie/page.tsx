// src/app/(private)/hladanie/page.tsx

"use client";

import ProfilesView from "@/sections/ProfilesView";
import Container from "@mui/material/Container";

export default function SearchPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProfilesView />
    </Container>
  );
}
