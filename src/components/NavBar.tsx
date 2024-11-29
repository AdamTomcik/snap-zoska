// NavBar.tsx
"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home, AddCircle, AccountCircle, ExitToApp, Login, AppRegistration, Search, Shield, Info, PersonAdd, PostAdd } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const { data: session } = useSession();  // Získavame informácie o používateľovi
  const [value, setValue] = useState(0);  // Stav pre označenú ikonu

  // Určujeme aktuálnu hodnotu pre navigačné ikony
  useEffect(() => {
    if (session) {
      setValue(2);  // Ak je prihlásený, nastavíme Profil ako aktívnu ikonu
    } else {
      setValue(0);  // Ak nie je prihlásený, nastavíme Domov ako aktívnu ikonu
    }
  }, [session]);

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        showLabels={true}
      >
        <BottomNavigationAction
          label="Domov"
          icon={<Home />}
          component={Link}
          href="/"
          style={{ color: value === 0 ? 'blue' : 'default' }}
        />

        {!session ? (
          <>
            <BottomNavigationAction
              label="GDPR"
              icon={<Shield />}
              component={Link}
              href="/gdpr"
              style={{ color: value === 1 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="O mne"
              icon={<Info />}
              component={Link}
              href="/about"
              style={{ color: value === 2 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="Registrácia"
              icon={<PersonAdd />}
              component={Link}
              href="/auth/registracia"
              style={{ color: value === 3 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="Prihlásenie"
              icon={<Login />}
              component={Link}
              href="/auth/prihlasenie"
              style={{ color: value === 4 ? 'blue' : 'default' }}
            />
          </>
        ) : (
          <>
            <BottomNavigationAction
              label="Hľadanie"
              icon={<Search />}
              component={Link}
              href="/search"
              style={{ color: value === 1 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="Profil"
              icon={<AccountCircle />}
              component={Link}
              href="/profil"
              style={{ color: value === 2 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="Pridať"
              icon={<PostAdd />}
              component={Link}
              href="/pridat"
              style={{ color: value === 3 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction
              label="Odhlásenie"
              icon={<ExitToApp />}
              component={Link}
              href="/auth/odhlasenie"
              style={{ color: value === 4 ? 'blue' : 'default' }}
            />
          </>
        )}
      </BottomNavigation>
    </Box>
  );
}
