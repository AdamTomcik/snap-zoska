// src/components/NavBar.tsx
'use client';

import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Home, AccountCircle, ExitToApp, Login, PersonAdd, Search, Shield, Info, PostAdd, Brightness4 } from '@mui/icons-material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NavBarProps {
  toggleDarkMode: () => void;
}

export default function NavBar({ toggleDarkMode }: NavBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigate = () => {
    router.push('/profil');
    handleClose();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    handleClose();
  };

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
      onClick={handleProfileClick}
    />,
    <BottomNavigationAction
      key="add"
      label="Pridať"
      icon={<PostAdd />}
      component={Link}
      href="/pridat"
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
        <IconButton onClick={toggleDarkMode}>
          <Brightness4 />
        </IconButton>
      </BottomNavigation>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleProfileNavigate}>Môj profil</MenuItem>
        <MenuItem onClick={handleLogout}>Odhlásiť sa</MenuItem>
      </Menu>
    </Box>
  );
}
