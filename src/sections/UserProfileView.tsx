"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CircularProgress from '@mui/material/CircularProgress';

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

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
}

export default function UserProfileView({ userId }: { userId: string }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleFollowToggle = async () => {
    // TODO: Implement follow/unfollow functionality
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile || !profile.user) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Profil sa nenašiel</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={profile.avatarUrl || profile.user.image || undefined}
              alt={profile.user.name || 'Profile'}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>

          {/* Profile Info */}
          <Grid item xs>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">{profile.user.name || 'Neznámy používateľ'}</Typography>
              {session?.user?.id !== userId && (
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleFollowToggle}
                  color={isFollowing ? "inherit" : "primary"}
                >
                  {isFollowing ? "Sledované" : "Sledovať"}
                </Button>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              {profile.user.email && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon fontSize="small" />
                  {profile.user.email}
                </Typography>
              )}
              {profile.location && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" />
                  {profile.location}
                </Typography>
              )}
            </Box>

            {profile.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.bio}
              </Typography>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Záujmy:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
          </Grid>
        </Grid>
      </Box>

      {/* Tabs and Content */}
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab icon={<ImageIcon />} label="PRÍSPEVKY" />
        </Tabs>

        {activeTab === 0 && (
          <ImageList cols={3} gap={8}>
            {posts.map((post) => (
              <ImageListItem key={post.id}>
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Post'}
                  loading="lazy"
                  style={{ aspectRatio: '1', objectFit: 'cover' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
    </Container>
  );
} 