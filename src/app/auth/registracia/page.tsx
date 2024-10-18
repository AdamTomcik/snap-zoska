"use client";

import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Registracia() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        flexDirection: 'column'
      }}
    >
      <h1>Registrácia</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('google')}  // Sign up via Google
      >
        Registrácia cez Google
      </Button>
    </Box>
  );
}
