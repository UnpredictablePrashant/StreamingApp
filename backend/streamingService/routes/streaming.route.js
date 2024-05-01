const express = require('express');
const routes = express.Router();

const streamingController = require('../controllers/streaming.controller')

routes.get('/', streamingController.streamingVideo)

module.exports = routes