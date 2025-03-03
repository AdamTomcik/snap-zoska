"use client";

import { useEffect, useState } from "react";
import { fetchProfileByUserId } from "@/app/actions/profiles";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LocationOn from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { useParams } from "next/navigation";

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

export default function ProfileDetail() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfileByUserId(userId);
        setProfile(profileData);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      }
    };

    loadProfile();
  }, [userId]);

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 800, margin: "0 auto" }}>
        <CardMedia
          component="img"
          height="300"
          image={profile.avatarUrl || "https://via.placeholder.com/300"}
          alt={profile.user.name || "Profile picture"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {profile.user.name || "Neznámy používateľ"}
          </Typography>
          
          {profile.location && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1 }} color="action" />
              <Typography variant="body1">{profile.location}</Typography>
            </Box>
          )}
          
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EmailIcon sx={{ mr: 1 }} color="action" />
            <Typography variant="body1">{profile.user.email}</Typography>
          </Box>

          {profile.bio && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                O mne
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.bio}
              </Typography>
            </Box>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Záujmy
              </Typography>
              <Typography variant="body1">
                {profile.interests.join(", ")}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
} 