"use client";

import { signIn } from "next-auth/react"; // Pokud používáš next-auth pro autentizaci
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Prihlasenie() {
  const router = useRouter();

  const handleLogin = async () => {
    // Simulace přihlášení (pokud používáš jiný mechanismus přihlášení)
    const result = await signIn("google"); // Používáme Google OAuth (pokud máš NextAuth)

    if (result?.ok) {
      // Po úspěšném přihlášení přesměruj na stránku prispevok
      router.push("/prispevok");
    } else {
      // Pokud přihlášení neprobíhá úspěšně, můžeš zobrazit nějakou chybovou hlášku
      alert("Chyba při přihlašování");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Prihlásenie</h1>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Prihlásiť sa
      </Button>
    </Box>
  );
}
