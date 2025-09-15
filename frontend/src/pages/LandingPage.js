import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  PlayArrow,
  DevicesOther,
  MovieFilter,
  HighQuality,
  Cancel,
  Speed,
} from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '85vh',
  background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/hero-bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.common.white,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(to bottom, transparent, #000)',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: theme.palette.common.white,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#000',
  color: theme.palette.common.white,
}));

export const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <DevicesOther fontSize="large" />,
      title: 'Watch Everywhere',
      description: 'Stream on your phone, tablet, laptop, and TV without paying more.',
    },
    {
      icon: <MovieFilter fontSize="large" />,
      title: 'Unlimited Movies',
      description: 'Enjoy unlimited access to our growing library of movies and shows.',
    },
    {
      icon: <HighQuality fontSize="large" />,
      title: 'HD Quality',
      description: 'Experience crystal clear HD quality streaming on all your devices.',
    },
    {
      icon: <Cancel fontSize="large" />,
      title: 'Cancel Anytime',
      description: 'No long-term contracts. No commitments. Cancel online anytime.',
    },
    {
      icon: <Speed fontSize="large" />,
      title: 'Fast Streaming',
      description: 'No buffering with our high-speed streaming technology.',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant={isMobile ? 'h3' : 'h1'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Unlimited Movies, TV Shows, and More
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Watch anywhere. Cancel anytime.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate('/register')}
                  sx={{ py: 1.5, px: 4 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ py: 1.5, px: 4 }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Section>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 8 }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    {feature.icon}
                    <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Start Watching Today
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Join millions of subscribers and get unlimited access to our extensive
                library of movies and TV shows.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ py: 1.5, px: 4 }}
              >
                Start Your Free Trial
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/devices.png"
                alt="Devices"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Box
        component="footer"
        sx={{
          py: 4,
          bgcolor: 'background.paper',
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2">
            © {new Date().getFullYear()} StreamFlix. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
