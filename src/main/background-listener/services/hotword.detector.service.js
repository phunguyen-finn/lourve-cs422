const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const path = require('path');

class HotwordDetectorService {
  porcupine;
  pvrecorder;

  constructor() {
    this.porcupine = new Porcupine(
      process.env.PORCUPINE_KEY,
      [path.join(".", "model", "porcupine_model.ppn")],
      [0.65],
      path.join(".", "model", "porcupine_params_ja.pv")
    );
    this.pvrecorder = new PvRecorder(-1, this.porcupine.frameLength);
  }

  async start() {
    const resolver = {};
    resolver.promise = new Promise((resolve, reject) => {
      resolver.resolve = resolve;
      resolver.reject = reject;
    });
    this.pvrecorder.start();

    while (true) {
      try {
        const frame = await this.pvrecorder.read();
        const result = this.porcupine.process(frame);
        if (result !== -1) {
          resolver.resolve();
          break;
        }
      } catch (error) {
        resolver.reject(error);
        break;
      }
    }

    return resolver.promise;
  }

  stop() {
    this.pvrecorder.stop();
  }

  clean() {
    this.pvrecorder.stop();
    this.porcupine.release();
    this.pvrecorder.release();
  }
}

module.exports = {
  HotwordDetectorService
}