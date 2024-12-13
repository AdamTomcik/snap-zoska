// src/app/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/NavBar';
import AuthProvider from '../components/AuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Zkontrolujeme, jestli je darkMode nastaveno v localStorage při načítání stránky
  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
    setDarkMode(savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    // Toggle darkMode a uložíme ho do localStorage
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  return (
    <html lang="sk">
      <body>
        <ThemeProvider darkMode={darkMode}>
          <AuthProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <main style={{ flexGrow: 1 }}>{children}</main>
            </div>
            <Navbar toggleDarkMode={toggleDarkMode} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
