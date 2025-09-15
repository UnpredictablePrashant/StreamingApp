const express = require('express');
const router = express.Router();
const {
  streamVideo,
  getVideosByGenre,
  getFeaturedVideos,
  getVideoDetails
} = require('../controllers/streaming.controller');

// Stream video
router.get('/stream', streamVideo);

// Get videos by genre
router.get('/videos', getVideosByGenre);

// Get featured videos
router.get('/videos/featured', getFeaturedVideos);

// Get video details
router.get('/videos/:videoId', getVideoDetails);

module.exports = router;