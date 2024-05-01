const express = require("express");
const app = express();
const fs = require("fs");
const videoPath = "D:/Projects/StreamingApp/backend/streamingService/controllers/theNights.mp4";
const CHUNK_SIZE = 10 ** 6; // 1000000 bytes = 1 mb


const streamingVideo = async (req,res) =>{
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoSize = fs.statSync(videoPath).size;
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
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}

module.exports = { streamingVideo }