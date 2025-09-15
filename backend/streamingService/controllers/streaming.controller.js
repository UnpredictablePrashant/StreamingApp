const { S3Client, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Video } = require('../models/video.model');

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const CHUNK_SIZE = 10 ** 6; // 1 MB

const streamVideo = async (req, res) => {
  try {
    // For now, use the fixed video key since we have one video
    const videoKey = 'theNights.mp4';
    
    const range = req.headers.range;
    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    // Get video size from S3
    const headObjectCommand = new HeadObjectCommand({
      Bucket: 'streamingappservicepk',
      Key: videoKey
    });

    const headObject = await s3Client.send(headObjectCommand);
    const videoSize = headObject.ContentLength;

    // Parse range
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    // Set response headers
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    // Stream the video chunk
    const getObjectCommand = new GetObjectCommand({
      Bucket: 'streamingappservicepk',
      Key: video.s3Key,
      Range: `bytes=${start}-${end}`
    });

    const { Body } = await s3Client.send(getObjectCommand);
    Body.pipe(res);
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({
      success: false,
      message: 'Error streaming video'
    });
  }
};

const getVideosByGenre = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'ready' })
      .select('title description thumbnailUrl genre releaseYear rating duration isFeatured')
      .sort('-createdAt');

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos'
    });
  }
};

const getFeaturedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isFeatured: true, status: 'ready' })
      .select('title description thumbnailUrl genre releaseYear rating duration')
      .sort('-createdAt')
      .limit(1);

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured videos'
    });
  }
};

const getVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId)
      .select('-s3Key');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Error fetching video details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video details'
    });
  }
};

module.exports = {
  streamVideo,
  getVideosByGenre,
  getFeaturedVideos,
  getVideoDetails
};