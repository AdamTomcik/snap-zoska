"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  interests: string[];
}

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    interests: '',
    avatarUrl: ''
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/prihlasenie');
      return;
    }

    // Fetch profile and posts
    fetchProfile();
    fetchUserPosts();
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${session?.user?.id}`);
      const data = await response.json();
      setProfile(data);
      setEditForm({
        bio: data.bio || '',
        location: data.location || '',
        interests: data.interests?.join(', ') || '',
        avatarUrl: data.avatarUrl || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${session?.user?.id}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`/api/profile/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: editForm.bio,
          location: editForm.location,
          interests: editForm.interests.split(',').map(i => i.trim()).filter(i => i),
          avatarUrl: editForm.avatarUrl
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={profile?.avatarUrl || session?.user?.image || undefined}
              alt={session?.user?.name || 'Profile'}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>

          {/* Profile Info */}
          <Grid item xs>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">{session?.user?.name}</Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditDialogOpen(true)}
              >
                Upraviť profil
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EmailIcon fontSize="small" />
                {session?.user?.email}
              </Typography>
              {profile?.location && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" />
                  {profile.location}
                </Typography>
              )}
            </Box>

            {profile?.bio && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profile.bio}
              </Typography>
            )}

            {profile?.interests && profile.interests.length > 0 && (
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

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upraviť profil</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="URL profilového obrázka"
              fullWidth
              value={editForm.avatarUrl}
              onChange={(e) => setEditForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
            />
            <TextField
              label="Lokalita"
              fullWidth
              value={editForm.location}
              onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
            />
            <TextField
              label="Záujmy (oddelené čiarkou)"
              fullWidth
              value={editForm.interests}
              onChange={(e) => setEditForm(prev => ({ ...prev, interests: e.target.value }))}
              helperText="Napríklad: fotografia, cestovanie, šport"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Zrušiť</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Uložiť
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
