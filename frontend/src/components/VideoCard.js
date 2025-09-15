import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 1,
    '& .MuiCardContent-root': {
      opacity: 1,
    },
  },
}));

const HoverContent = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const VideoCard = ({ video, onPlay, onInfo }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={video.thumbnailUrl}
        alt={video.title}
      />
      <HoverContent>
        <Typography variant="h6" component="div">
          {video.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ActionButton onClick={() => onPlay(video)}>
            <PlayArrow />
            <Typography variant="body2">Play</Typography>
          </ActionButton>
          <ActionButton onClick={() => onInfo(video)}>
            <Info />
            <Typography variant="body2">More Info</Typography>
          </ActionButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {video.genre} • {video.releaseYear}
        </Typography>
      </HoverContent>
    </StyledCard>
  );
};
