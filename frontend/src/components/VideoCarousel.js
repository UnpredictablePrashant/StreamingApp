import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { VideoCard } from './VideoCard';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2, 4),
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
}));

const CarouselTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  transition: 'transform 0.5s ease-in-out',
  overflowX: 'hidden',
}));

const CarouselButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  zIndex: 2,
}));

export const VideoCarousel = ({ title, videos, onPlay, onInfo }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setStartIndex((prev) => 
      Math.min(prev + itemsPerPage, Math.max(0, videos.length - itemsPerPage))
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, px: 4 }}>
        {title}
      </Typography>
      <CarouselContainer>
        <CarouselButton
          onClick={handlePrevious}
          disabled={startIndex === 0}
          sx={{ left: theme => theme.spacing(1) }}
        >
          <ChevronLeft />
        </CarouselButton>
        
        <CarouselTrack
          sx={{
            transform: `translateX(-${startIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {videos.map((video) => (
            <Box
              key={video._id}
              sx={{ flex: `0 0 ${100 / itemsPerPage}%` }}
            >
              <VideoCard
                video={video}
                onPlay={onPlay}
                onInfo={onInfo}
              />
            </Box>
          ))}
        </CarouselTrack>

        <CarouselButton
          onClick={handleNext}
          disabled={startIndex >= videos.length - itemsPerPage}
          sx={{ right: theme => theme.spacing(1) }}
        >
          <ChevronRight />
        </CarouselButton>
      </CarouselContainer>
    </Box>
  );
};
