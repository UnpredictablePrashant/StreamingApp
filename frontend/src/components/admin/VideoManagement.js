import React, { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-toastify';
import { adminService } from '../../services/admin.service';

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

  const fetchVideos = useCallback(async () => {
    try {
      const data = await adminService.listVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Unable to load videos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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
      const payload = {
        title: editVideo.title,
        description: editVideo.description,
        genre: editVideo.genre,
        releaseYear: Number(editVideo.releaseYear),
        duration: Number(editVideo.duration),
        isFeatured: !!editVideo.isFeatured,
      };
      await adminService.updateVideo(editVideo._id, payload);
      toast.success('Video updated');
      handleDialogClose();
      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video.');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await adminService.deleteVideo(videoId);
        toast.success('Video deleted');
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video.');
      }
    }
  };

  const handleToggleFeatured = async (videoId, isFeatured) => {
    try {
      await adminService.toggleFeatured(videoId, !isFeatured);
      toast.success('Featured status updated');
      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId ? { ...video, isFeatured: !isFeatured } : video,
        ),
      );
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status.');
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
              <TextField
                fullWidth
                type="number"
                label="Duration (seconds)"
                name="duration"
                value={editVideo.duration}
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
