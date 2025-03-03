"use client";

import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LocationOn from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter } from "next/navigation";
import debounce from 'lodash/debounce';

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

const ProfilesView = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Create a stable search function with useCallback
  const searchProfiles = useCallback(async (term: string) => {
    try {
      setLoading(true);
      const fetchedProfiles = await fetchProfiles(term);
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a stable debounced function with useCallback
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      searchProfiles(term);
    }, 300),
    [searchProfiles]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/hladanie/${userId}`);
  };

  // Load all profiles on initial render
  useEffect(() => {
    searchProfiles("");
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchProfiles, debouncedSearch]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Hľadať používateľov
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Hľadať podľa mena alebo záujmov"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Typography>Načítavam...</Typography>
      ) : profiles.length === 0 ? (
        <Typography>Nenašli sa žiadni používatelia</Typography>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
                onClick={() => handleProfileClick(profile.userId)}
              >
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
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {profile.bio}
                    </Typography>
                  )}
                  {profile.interests && profile.interests.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Záujmy:
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {profile.interests.join(", ")}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProfilesView; 