"use client";

// React imports
import { useEffect, useState } from "react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LocationOn from "@mui/icons-material/LocationOn";

// Server action import
import { fetchProfiles } from "@/app/actions/profiles";

// Profile interface
interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
  };
}

const SearchView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const fetchedProfiles = await fetchProfiles(searchTerm);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      loadProfiles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Hľadať používateľov
      </Typography>

      <TextField
        fullWidth
        label="Hľadať podľa mena alebo záujmov"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={profile.avatarUrl || "https://via.placeholder.com/200"}
                alt={profile.user.name || "Neznámy používateľ"}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {profile.user.name || "Neznámy používateľ"}
                </Typography>
                {profile.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1 }} color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {profile.location}
                    </Typography>
                  </Box>
                )}
                {profile.bio && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {profile.bio}
                  </Typography>
                )}
                {profile.interests.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Záujmy:
                    </Typography>
                    <Typography variant="body2">
                      {profile.interests.join(", ")}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchView; 