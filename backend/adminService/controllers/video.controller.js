const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Video } = require('../../common/models/video.model');
const { s3Client, buildPublicUrl } = require('../../common/s3');

const bucket = process.env.AWS_S3_BUCKET;

const ensureBucket = () => {
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET is not configured');
  }
};

const formatVideo = (doc) => {
  if (!doc) {
    return null;
  }

  const video = typeof doc.toObject === 'function'
    ? doc.toObject({ versionKey: false })
    : { ...doc };

  if (video.thumbnailKey) {
    video.thumbnailUrl = buildPublicUrl(video.thumbnailKey);
  }

  return video;
};

const resolveThumbnailData = ({ thumbnailKey, thumbnailUrl }) => {
  if (thumbnailKey) {
    return {
      thumbnailKey,
      thumbnailUrl: buildPublicUrl(thumbnailKey),
    };
  }

  if (thumbnailUrl) {
    return { thumbnailUrl };
  }

  return {};
};

const listVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      videos: videos.map(formatVideo),
    });
  } catch (error) {
    next(error);
  }
};

const getUploadUrls = async (req, res, next) => {
  try {
    ensureBucket();
    const { videoFileName, thumbnailFileName } = req.body;

    if (!videoFileName || !thumbnailFileName) {
      return res.status(400).json({
        success: false,
        message: 'Both video and thumbnail file names are required',
      });
    }

    const now = Date.now();
    const videoKey = `videos/${now}-${videoFileName}`;
    const thumbnailKey = `thumbnails/${now}-${thumbnailFileName}`;

    const [videoUploadUrl, thumbnailUploadUrl] = await Promise.all([
      getSignedUrl(
        s3Client,
        new PutObjectCommand({ Bucket: bucket, Key: videoKey }),
        { expiresIn: 3600 },
      ),
      getSignedUrl(
        s3Client,
        new PutObjectCommand({ Bucket: bucket, Key: thumbnailKey }),
        { expiresIn: 3600 },
      ),
    ]);

    res.json({
      success: true,
      videoUploadUrl,
      thumbnailUploadUrl,
      videoKey,
      thumbnailKey,
    });
  } catch (error) {
    next(error);
  }
};

const createVideo = async (req, res, next) => {
  try {
    ensureBucket();
    const {
      s3Key,
      duration,
      thumbnailKey,
      thumbnailUrl,
      status,
      ...rest
    } = req.body;

    if (!s3Key) {
      return res.status(400).json({
        success: false,
        message: 's3Key is required',
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: 'Video duration is required',
      });
    }

    if (!thumbnailKey && !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: 'A thumbnail must be provided',
      });
    }

    const durationSeconds = Number(duration);
    if (Number.isNaN(durationSeconds) || durationSeconds <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be a positive number',
      });
    }

    const thumbnailData = resolveThumbnailData({ thumbnailKey, thumbnailUrl });

    const video = await Video.create({
      ...rest,
      ...thumbnailData,
      s3Key,
      duration: durationSeconds,
      uploadedBy: req.user._id,
      status: status || 'ready',
    });

    res.status(201).json({
      success: true,
      video: formatVideo(video),
    });
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const {
      thumbnailKey,
      thumbnailUrl,
      ...rest
    } = req.body;

    const thumbnailData = resolveThumbnailData({ thumbnailKey, thumbnailUrl });

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { ...rest, ...thumbnailData, updatedAt: Date.now() },
      { new: true },
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.json({
      success: true,
      video: formatVideo(video),
    });
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    ensureBucket();
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const operations = [
      s3Client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: video.s3Key,
      })),
      video.deleteOne(),
    ];

    if (video.thumbnailKey) {
      operations.push(
        s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: video.thumbnailKey,
          }),
        ),
      );
    }

    await Promise.all(operations);

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const toggleFeatured = async (req, res, next) => {
  try {
    const { isFeatured } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isFeatured, updatedAt: Date.now() },
      { new: true },
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.json({
      success: true,
      video: formatVideo(video),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listVideos,
  getUploadUrls,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleFeatured,
};
