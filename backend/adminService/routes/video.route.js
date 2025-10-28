const express = require('express');
const { adminAuth } = require('../middleware/adminAuth');
const controller = require('../controllers/video.controller');

const router = express.Router();

router.get('/videos', adminAuth, controller.listVideos);
router.post('/videos/upload-urls', adminAuth, controller.getUploadUrls);
router.post('/videos', adminAuth, controller.createVideo);
router.put('/videos/:id', adminAuth, controller.updateVideo);
router.delete('/videos/:id', adminAuth, controller.deleteVideo);
router.patch('/videos/:id/featured', adminAuth, controller.toggleFeatured);

module.exports = router;
