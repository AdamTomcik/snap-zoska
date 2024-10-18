"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home, AddCircle, AccountCircle, ExitToApp, Login, AppRegistration } from '@mui/icons-material';
import { useState } from 'react';

export default function NavBar() {
  const { data: session } = useSession();
  const [value, setValue] = useState(0);

  return (
    <Box 
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels={true}  // Ensure all icons show labels
      >
        <BottomNavigationAction 
          label="Domov"
          icon={<Home />}
          component={Link}
          href="/"
          style={{ color: value === 0 ? 'blue' : 'default' }} 
        />
        {session ? (
          <>
            <BottomNavigationAction 
              label="Profil"
              icon={<AccountCircle />}
              component={Link}
              href="/profil"
              style={{ color: value === 1 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction 
              label="Pridať príspevok"
              icon={<AddCircle />}
              component={Link}
              href="/pridat"
              style={{ color: value === 2 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction 
              label="Odhlásenie"
              icon={<ExitToApp />}
              component={Link}
              href="/auth/odhlasenie"
              style={{ color: value === 3 ? 'blue' : 'default' }}
            />
          </>
        ) : (
          <>
            <BottomNavigationAction 
              label="Príspevky"
              icon={<AddCircle />}
              component={Link}
              href="/prispevok"
              style={{ color: value === 1 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction 
              label="Registrácia"  // Label for "Registrácia" button
              icon={<AppRegistration />} 
              component={Link}
              href="/auth/registracia"  // Link to the registration page
              style={{ color: value === 2 ? 'blue' : 'default' }}
            />
            <BottomNavigationAction 
              label="Prihlásenie"
              icon={<Login />}
              component={Link}
              href="/auth/prihlasenie"
              style={{ color: value === 3 ? 'blue' : 'default' }}
            />
          </>
        )}
      </BottomNavigation>
    </Box>
  );
}
