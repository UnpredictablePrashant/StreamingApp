const express = require("express");
const app = express();
const awsSdk = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK for S3
const awsS3Bucket = process.env.AWS_S3_BUCKET;
const awsRegion = process.env.AWS_REGION;
const awsKey = process.env.AWS_KEY_ID;
const awsSecret = process.env.AWS_SECRET_KEY;

awsSdk.config.update({
  accessKeyId: awsKey,
  secretAccessKey: awsSecret,
  region: awsRegion
});

const s3 = new awsSdk.S3();
const videoKey = "theNights.mp4"; // Adjust the path to your video in the S3 bucket
const CHUNK_SIZE = 10 ** 6; // 1 MB

const isUsingS3 = process.env.USE_S3 === 'true'; // Use this environment variable to decide whether to stream from S3 or local file

const streamingVideo = async (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
        return;
    }

    if (isUsingS3) {
        // Streaming from S3
        const params = {
            Bucket: awsS3Bucket,
            Key: videoKey
        };

        try {
            const headCode = await s3.headObject(params).promise();
            const videoSize = headCode.ContentLength;

            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;

            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, headers);

            // Stream the video directly from S3
            const streamParams = {
                Bucket: awsS3Bucket,
                Key: videoKey,
                Range: `bytes=${start}-${end}`
            };

            const videoStream = s3.getObject(streamParams).createReadStream();
            videoStream.pipe(res);
        } catch (error) {
            console.error('Error in fetching video from S3:', error);
            res.status(500).send('Error in fetching video from S3');
        }
    } else {
        // Streaming from local file system
        const videoPath = path.join(__dirname, 'streamingService', 'controllers', 'theNights.mp4'); // Adjust the path to your setup
        const videoStats = fs.statSync(videoPath);
        const videoSize = videoStats.size;

        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, videoSize - 1);
        const chunkSize = end - start + 1;

        const videoStream = fs.createReadStream(videoPath, { start, end });

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        videoStream.pipe(res);
    }
};

app.get('/streaming', streamingVideo);

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { streamingVideo };
