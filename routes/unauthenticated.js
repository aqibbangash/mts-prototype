var video = require('../api/video.js');
const express = require('express');
var app = express();
var router = express.Router();

//router.post('/getVideos',video.getVideos);
//router.post('/combineTickers',video.combineTickers);
router.post('/createTranscription',video.createTranscription);
router.post('/createbucket',video.createbucket);
router.post('/uploadFileToBucket',video.uploadFileToBucket);
// router.post('/uploadFile',video.uploadFile);
router.post('/getClip',video.getClip);
router.post('/getVideosUrls',video.getVideosUrls);
//router.post('/checkLogoChange',video.checkLogoChange);
module.exports = router;
