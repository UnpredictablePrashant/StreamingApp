import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  Delete,
  Star,
  StarBorder,
} from '@mui/icons-material';
import axios from 'axios';

const STREAMING_API = 'http://localhost:3002/api';

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Documentary',
  'Thriller',
  'Romance',
  'Sci-Fi',
];

export const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editVideo, setEditVideo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${STREAMING_API}/admin/videos`);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (video) => {
    setEditVideo(video);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditVideo(null);
    setOpenDialog(false);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${STREAMING_API}/admin/videos/${editVideo._id}`, editVideo);
      fetchVideos();
      handleDialogClose();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${STREAMING_API}/admin/videos/${videoId}`);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleToggleFeatured = async (videoId, isFeatured) => {
    try {
      await axios.patch(`${STREAMING_API}/admin/videos/${videoId}/featured`, {
        isFeatured: !isFeatured,
      });
      fetchVideos();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditVideo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Videos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Release Year</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video._id}>
                <TableCell>{video.title}</TableCell>
                <TableCell>{video.genre}</TableCell>
                <TableCell>{video.releaseYear}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleToggleFeatured(video._id, video.isFeatured)}
                  >
                    {video.isFeatured ? <Star color="primary" /> : <StarBorder />}
                  </IconButton>
                </TableCell>
                <TableCell>{video.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(video)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteVideo(video._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          {editVideo && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editVideo.title}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={editVideo.description}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                select
                label="Genre"
                name="genre"
                value={editVideo.genre}
                onChange={handleInputChange}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="number"
                label="Release Year"
                name="releaseYear"
                value={editVideo.releaseYear}
                onChange={handleInputChange}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Featured</Typography>
                <Switch
                  checked={editVideo.isFeatured}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: 'isFeatured', value: e.target.checked },
                    })
                  }
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
