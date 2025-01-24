'use client';

import { useState } from 'react';  // Import useState to manage checkbox state
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';  // For the white card-like container
import { useTheme } from '@mui/material/styles';  // To access the current theme
import Link from 'next/link';  // Import Link component for navigation

export default function Registracia() {
  const [isChecked, setIsChecked] = useState(false);  // Manage the checkbox state
  const router = useRouter();
  const theme = useTheme();  // Access the theme

  const handleRegister = async () => {
    // Simulate the registration process (you can add actual registration logic here)
    alert('Successful registration!');  // Replace with actual registration logic
    router.push('/prispevok');  // Redirect to the "prispevok" page after successful registration
  };

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);  // Toggle checkbox state
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
          width: 400,  // Limit the width of the registration box
          padding: 3,  // Add padding inside the Paper
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Registrácia</h1>
        
        {/* Text with checkbox */}
        <Box
          sx={{
            marginBottom: 2, // Space between text and button
            textAlign: 'center',
            fontSize: '1rem',
            color: theme.palette.text.primary,  // Use theme text color
          }}
        >
          SÚHLASÍTE S PODMIENKAMI GDPR?AK ÁNO KLIKNITE NA ŠTVOREC{' '}
          
          {/* Small checkbox block */}
          <Box
            onClick={handleCheckboxClick}
            sx={{
              display: 'inline-block',
              width: 20,
              height: 20,
              border: `2px solid ${theme.palette.primary.main}`,
              backgroundColor: isChecked ? theme.palette.primary.main : 'transparent',
              cursor: 'pointer',
              marginLeft: 1,
            }}
          ></Box>
        </Box>

        {/* Text with link to login page */}
        <Box
          sx={{
            marginBottom: 2,  // Space between checkbox and "Ste už registrovaní?" text
            textAlign: 'center',
            fontSize: '0.9rem',
            color: theme.palette.text.primary,
          }}
        >
          Ste už registrovaní?{' '}
          <Link href="/auth/prihlasenie">
            <span
              style={{
                color: theme.palette.primary.main,
                fontSize: '1rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Prihláste sa
            </span>
          </Link>
        </Box>

        {/* Register button */}
        <Button
          variant="contained"
          onClick={handleRegister}
          sx={{
            width: '100%',  // Full-width button inside the Paper component
            fontSize: '1.1rem',
            padding: '12px 24px',  // Button padding
            backgroundColor: theme.palette.error.main,  // Red color for the button
            '&:hover': {
              backgroundColor: theme.palette.error.dark,  // Darker red when hovered
            },
            opacity: isChecked ? 1 : 0.5,  // Disable button if not checked
            pointerEvents: isChecked ? 'auto' : 'none',  // Disable pointer events if not checked
          }}
        >
          Registrovať sa
        </Button>
      </Paper>
    </Box>
  );
}
