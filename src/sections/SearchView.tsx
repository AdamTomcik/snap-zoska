"use client";

// React imports
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

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
import { debounce } from 'lodash';

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
    email: string | null;
    image: string | null;
  };
}

const SearchView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    try {
      const results = await fetchProfiles(term);
      setProfiles(results);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

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
                image={profile.avatarUrl || profile.user.image || "https://via.placeholder.com/200"}
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
                    <Typography variant="subtitle2" gutterBottom>
                      Záujmy:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {profile.interests.map((interest, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            bgcolor: 'action.selected',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {interest}
                        </Typography>
                      ))}
                    </Box>
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