const { s3Client, buildPublicUrl } = require('../../common/s3');

const buildStreamUrl = (videoId) => {
  const base = process.env.STREAMING_PUBLIC_URL?.replace(/\/$/, '');
  const path = `/api/streaming/stream/${videoId}`;
  if (!base) {
    return path;
  }
  return `${base}${path}`;
};

module.exports = {
  s3Client,
  buildPublicUrl,
  buildStreamUrl,
};
