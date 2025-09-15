import React, { useState, useEffect } from 'react';
import { Box, Dialog, CircularProgress } from '@mui/material';
import { Header } from '../components/Header';
import { UserDebug } from '../components/UserDebug';
import { HeroSection } from '../components/HeroSection';
import { VideoCarousel } from '../components/VideoCarousel';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoDetails } from '../components/VideoDetails';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const STREAMING_API = 'http://localhost:3002/api';

export const Browse = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(null);
  const [videosByGenre, setVideosByGenre] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const [featuredRes, genresRes] = await Promise.all([
          axios.get(`${STREAMING_API}/streaming/videos/featured`),
          axios.get(`${STREAMING_API}/streaming/videos`)
        ]);

        if (featuredRes.data.success && featuredRes.data.videos.length > 0) {
          setFeatured(featuredRes.data.videos[0]);
        }

        if (genresRes.data.success) {
          // Group videos by genre
          const videos = genresRes.data.videos;
          const genres = [...new Set(videos.map(v => v.genre))];
          const groupedVideos = genres.map(genre => ({
            genre,
            videos: videos.filter(v => v.genre === genre)
          }));
          setVideosByGenre(groupedVideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleInfo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredVideos = videosByGenre.map(group => ({
    genre: group.genre,
    videos: group.videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.videos.length > 0);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header onSearch={handleSearch} />
      <HeroSection
        featured={featured}
        onPlay={handlePlay}
        onInfo={handleInfo}
      />

      <Box sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        {filteredVideos.map((genreGroup) => (
          <VideoCarousel
            key={genreGroup.genre}
            title={genreGroup.genre}
            videos={genreGroup.videos}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        ))}
      </Box>

      <Dialog
        fullScreen
        open={!!selectedVideo}
        onClose={handleClose}
      >
        {selectedVideo && (
          isPlaying ? (
            <VideoPlayer
              video={selectedVideo}
              onClose={handleClose}
            />
          ) : (
            <VideoDetails
              video={selectedVideo}
              onPlay={() => setIsPlaying(true)}
              onClose={handleClose}
            />
          )
        )}
      </Dialog>
      <UserDebug />
    </Box>
  );
};
