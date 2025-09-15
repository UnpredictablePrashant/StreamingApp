const express = require('express');
const router = express.Router();
const { adminAuth } = require('../../authService/middleware/adminAuth');
const { Video } = require('../models/video.model');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Get all videos (admin view)
router.get('/videos', adminAuth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
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
});

// Get pre-signed URLs for video and thumbnail upload
router.post('/videos/upload-urls', adminAuth, async (req, res) => {
  try {
    const { videoFileName, thumbnailFileName } = req.body;
    
    const videoKey = `videos/${Date.now()}-${videoFileName}`;
    const thumbnailKey = `thumbnails/${Date.now()}-${thumbnailFileName}`;

    const videoCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: videoKey,
    });

    const thumbnailCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: thumbnailKey,
    });

    const [videoUploadUrl, thumbnailUploadUrl] = await Promise.all([
      getSignedUrl(s3Client, videoCommand, { expiresIn: 3600 }),
      getSignedUrl(s3Client, thumbnailCommand, { expiresIn: 3600 }),
    ]);

    res.json({
      success: true,
      videoUploadUrl,
      thumbnailUploadUrl,
      videoKey,
      thumbnailKey,
    });
  } catch (error) {
    console.error('Error generating upload URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating upload URLs'
    });
  }
});

// Create new video
router.post('/videos', adminAuth, async (req, res) => {
  try {
    const videoData = {
      ...req.body,
      uploadedBy: req.user._id,
    };

    const video = new Video(videoData);
    await video.save();

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating video'
    });
  }
});

// Update video
router.put('/videos/:id', adminAuth, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

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
    console.error('Error updating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video'
    });
  }
});

// Delete video
router.delete('/videos/:id', adminAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Delete from S3
    const deleteVideoCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: video.s3Key,
    });

    const deleteThumbnailCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: video.thumbnailUrl,
    });

    await Promise.all([
      s3Client.send(deleteVideoCommand),
      s3Client.send(deleteThumbnailCommand),
      video.delete(),
    ]);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video'
    });
  }
});

// Toggle featured status
router.patch('/videos/:id/featured', adminAuth, async (req, res) => {
  try {
    const { isFeatured } = req.body;
    
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isFeatured, updatedAt: Date.now() },
      { new: true }
    );

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
    console.error('Error updating featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating featured status'
    });
  }
});

module.exports = router;
