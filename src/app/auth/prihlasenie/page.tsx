'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';  // For clickable "kliknutím sem"
import Paper from '@mui/material/Paper';  // For the white card-like container
import { useTheme } from '@mui/material/styles';  // To access the current theme

export default function Prihlasenie() {
  const router = useRouter();
  const theme = useTheme();  // Access the theme

  const handleLogin = async () => {
    const result = await signIn('google');  // Trigger Google sign-in using NextAuth

    if (result?.ok) {
      router.push('/prispevky');  // Redirect to the "prispevky" page after successful login
    } else {
      alert('Chyba pri prihlásení');  // Display error message if login fails
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,  // Set background to default theme color
      }}
    >
      {/* Wrap content in a Paper component to create the card-style container */}
      <Paper
        elevation={3}  // Adds shadow to the paper to create the card-like effect
        sx={{
          width: 400,  // Limit the width of the login box
          padding: 3,  // Add padding inside the Paper
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Prihlásenie</h1>
        
        {/* Text above the button */}
        <Box
          sx={{
            marginBottom: 2, // Space between text and button
            textAlign: 'center',
            fontSize: '1rem',
            color: theme.palette.text.primary,  // Use theme text color
          }}
        >
          Príhlaste sa kliknutím na tlačítko alebo{' '}
          {/* Link for "kliknutím sem" */}
          <Link
            href="#"
            onClick={handleLogin}
            style={{
              color: theme.palette.primary.main,  // Link color from the theme
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            kliknutím sem
          </Link>
        </Box>

        {/* Login button */}
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            width: '100%',  // Full-width button inside the Paper component
            fontSize: '1.1rem',
            padding: '12px 24px',  // Button padding
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,  // Darker red when hovered
            },
          }}
        >
          Prihlásiť sa
        </Button>
      </Paper>
    </Box>
  );
}
