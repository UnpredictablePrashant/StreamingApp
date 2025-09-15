import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '7.5rem',
    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
  },
}));

const HeroBackdrop = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%',
    bottom: 0,
    background: 'linear-gradient(90deg, rgba(0,0,0,0.8), transparent)',
  },
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  paddingTop: theme.spacing(8),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export const HeroSection = ({ featured, onPlay, onInfo }) => {
  if (!featured) return null;

  return (
    <HeroContainer>
      <HeroBackdrop
        sx={{
          backgroundImage: `url(${featured.thumbnailUrl})`,
        }}
      />
      <HeroContent>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            maxWidth: '40%',
          }}
        >
          {featured.title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            maxWidth: '40%',
          }}
        >
          {featured.description}
        </Typography>
        <ButtonContainer>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={() => onPlay(featured)}
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.75)',
              },
            }}
          >
            Play
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Info />}
            onClick={() => onInfo(featured)}
            sx={{
              bgcolor: 'rgba(109, 109, 110, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(109, 109, 110, 0.4)',
              },
            }}
          >
            More Info
          </Button>
        </ButtonContainer>
      </HeroContent>
    </HeroContainer>
  );
};
