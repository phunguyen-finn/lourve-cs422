require('dotenv').config();
const { HotwordDetectorService } = require('../services/hotword.detector.service');
const { PromptDecectorService } = require('../services/prompt.detector.service');
const { BackgroundListenterController } = require('../controllers/background.listener.controller');

const hotwordDetectorService = new HotwordDetectorService();
const promptDetectorService = new PromptDecectorService();
const backgroundListenterController = new BackgroundListenterController(hotwordDetectorService, promptDetectorService);

module.exports = {
  backgroundListenterController
};