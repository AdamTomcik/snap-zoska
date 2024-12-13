// src/components/ThemeProvider.tsx
'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  darkMode: boolean;
}

export default function ThemeProvider({ children, darkMode }: ThemeProviderProps) {
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f44336', // Nastavení červené barvy pro tlačítka
      },
      background: {
        default: darkMode ? '#121212' : '#fff',
        paper: darkMode ? '#333' : '#fff',
      },
      text: {
        primary: darkMode ? '#fff' : '#000',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#f44336', // Nastavení červené pro tlačítka
            color: 'white',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 'bold',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
