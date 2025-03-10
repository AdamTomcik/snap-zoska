"use client";

// React imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

// Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

// Server actions
import { fetchPosts, toggleLike, addComment, deleteComment } from "@/app/actions/posts";

// Types
interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  user: User;
}

interface Like {
  userId: string;
}

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  user: User;
  likes: Like[];
  comments: Comment[];
}

const PostsView = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!session?.user?.email) return;

    try {
      const userId = session.user.id as string;
      const isNowLiked = await toggleLike(postId, userId);
      
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: isNowLiked
                  ? [...post.likes, { userId }]
                  : post.likes.filter(like => like.userId !== userId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!session?.user?.email || !commentInputs[postId]?.trim()) return;

    try {
      const userId = session.user.id as string;
      const newComment = await addComment(postId, userId, commentInputs[postId]);
      
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [newComment, ...post.comments],
              }
            : post
        )
      );
      
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string, userId: string) => {
    if (!session?.user?.email) return;

    try {
      await deleteComment(commentId, userId);
      
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(comment => comment.id !== commentId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sk-SK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Príspevky
      </Typography>
      <Stack spacing={3}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ width: '100%' }}>
            {/* Post Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={post.user.image || undefined} 
                alt={post.user.name || 'User'} 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleProfileClick(post.userId)}
              />
              <Typography 
                variant="subtitle1" 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleProfileClick(post.userId)}
              >
                {post.user.name}
              </Typography>
            </Box>
            
            {/* Post Image */}
            <CardMedia
              component="img"
              image={post.imageUrl}
              alt={post.caption || "Post image"}
              sx={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
            />
            
            {/* Actions */}
            <CardActions disableSpacing>
              <IconButton 
                onClick={() => handleLike(post.id)}
                color={post.likes.some(like => like.userId === session?.user?.id) ? "error" : "default"}
              >
                {post.likes.some(like => like.userId === session?.user?.id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <IconButton onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                <ChatBubbleOutlineIcon />
              </IconButton>
            </CardActions>
            
            {/* Likes count */}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {post.likes.length} páči sa mi to
              </Typography>
            </CardContent>

            {/* Caption */}
            {post.caption && (
              <CardContent sx={{ py: 0 }}>
                <Typography variant="body1">
                  <strong>{post.user.name}</strong> {post.caption}
                </Typography>
              </CardContent>
            )}
            
            {/* Date */}
            <CardContent sx={{ py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </CardContent>

            {/* Comments Section */}
            <Collapse in={expandedPost === post.id} timeout="auto" unmountOnExit>
              <Divider />
              <CardContent>
                {/* Comment Input */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Pridať komentár..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment(post.id);
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                  >
                    Pridať
                  </Button>
                </Box>

                {/* Comments List */}
                <Stack spacing={2}>
                  {post.comments.map((comment) => (
                    <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar
                        src={comment.user.image || undefined}
                        alt={comment.user.name || 'User'}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">
                          {comment.user.name}
                        </Typography>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      {session?.user?.id === comment.userId && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteComment(post.id, comment.id, comment.userId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PostsView;