import React from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Rating,
  Stack,
} from '@mui/material';
import {
  Close,
  PlayArrow,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DetailsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const BackdropImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '70vh',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))',
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  marginTop: -theme.spacing(20),
}));

export const VideoDetails = ({ video, onPlay, onClose }) => {
  return (
    <DetailsContainer>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.7)',
          },
        }}
      >
        <Close />
      </IconButton>

      <BackdropImage
        sx={{
          backgroundImage: `url(${video.thumbnailUrl})`,
        }}
      />

      <ContentContainer>
        <Typography variant="h3" component="h1" gutterBottom>
          {video.title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={onPlay}
          >
            Play
          </Button>

          <Rating
            value={video.rating}
            readOnly
            precision={0.5}
            sx={{ ml: 2 }}
          />

          <Typography variant="body2" color="text.secondary">
            {video.releaseYear} • {Math.floor(video.duration / 60)} min
          </Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {video.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Genre:
          </Typography>
          <Typography variant="body2">
            {video.genre}
          </Typography>
        </Stack>
      </ContentContainer>
    </DetailsContainer>
  );
};
