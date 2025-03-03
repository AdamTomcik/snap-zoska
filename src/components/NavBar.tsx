// src/components/NavBar.tsx
'use client';

import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, IconButton } from '@mui/material';
import { Home, AccountCircle, ExitToApp, Login, PersonAdd, Search, Shield, Info, PostAdd, Brightness4 } from '@mui/icons-material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface NavBarProps {
  toggleDarkMode: () => void;
}

export default function NavBar({ toggleDarkMode }: NavBarProps) {
  const { data: session } = useSession();
  const [value, setValue] = useState(0);

  const loggedOutNavItems = [
    <BottomNavigationAction
      key="gdpr"
      label="GDPR"
      icon={<Shield />}
      component={Link}
      href="/gdpr"
    />,
    <BottomNavigationAction
      key="o-mne"
      label="O mne"
      icon={<Info />}
      component={Link}
      href="/about"
    />,
    <BottomNavigationAction
      key="register"
      label="Registrácia"
      icon={<PersonAdd />}
      component={Link}
      href="/auth/registracia"
    />,
    <BottomNavigationAction
      key="login"
      label="Prihlásenie"
      icon={<Login />}
      component={Link}
      href="/auth/prihlasenie"
    />,
  ];

  const loggedInNavItems = [
    <BottomNavigationAction
      key="search"
      label="Hľadanie"
      icon={<Search />}
      component={Link}
      href="/hladanie"
    />,
    <BottomNavigationAction
      key="profile"
      label="Profil"
      icon={<AccountCircle />}
      component={Link}
      href="/profil"
    />,
    <BottomNavigationAction
      key="add"
      label="Pridať"
      icon={<PostAdd />}
      component={Link}
      href="/pridat"
    />,
    <BottomNavigationAction
      key="logout"
      label="Odhlásenie"
      icon={<ExitToApp />}
      component={Link}
      href="/auth/odhlasenie"
    />,
  ];

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        showLabels
      >
        <BottomNavigationAction
          label="Domov"
          icon={<Home />}
          component={Link}
          href="/"
        />
        {session ? loggedInNavItems : loggedOutNavItems}
        {/* Ikona pro přepnutí dark mode */}
        <IconButton onClick={toggleDarkMode}>
          <Brightness4 />
        </IconButton>
      </BottomNavigation>
    </Box>
  );
}
