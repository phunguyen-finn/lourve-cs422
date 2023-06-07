class BackgroundListenterController {
  hotwordDetectorService;
  promptDetectorService;

  constructor(hotwordDetectorService, promptDetectorService) {
    this.hotwordDetectorService = hotwordDetectorService;
    this.promptDetectorService = promptDetectorService;
  }

  async startHotwordDetecting() {
    return this.hotwordDetectorService.start();
  }

  async startPromptDetecting() {
    return this.promptDetectorService.start();
  }

  stopHotwordDetecting() {
    this.hotwordDetectorService.stop();
  }

  stopPromptDetecting() {
    this.promptDetectorService.stop();
  }

  clean() {
    this.hotwordDetectorService.clean();
    this.promptDetectorService.clean();
  } 
}

module.exports = {
  BackgroundListenterController
};