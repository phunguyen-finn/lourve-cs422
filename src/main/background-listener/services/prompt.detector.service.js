const  record_lpcm16 = require('node-record-lpcm16');
const { Writable } = require('stream');
const path = require('path');
const { SECONDS_BEFORE_END } = require('../constant');

class PromptDecectorService {
  recorder;

  start() {
    const resolver = {};
    resolver.promise = new Promise((resolve, reject) => {
      resolver.resolve = resolve;
      resolver.reject = reject;
    });

    let buffer = null;

    const bufferStream = new Writable({
      write(chunk, encoding, callback) {
        if (!buffer) {
          buffer = Buffer.from(chunk, encoding);
        } else {
          buffer = Buffer.concat([buffer, chunk], buffer.length + chunk.length);
        }
        callback();
      },
    });
    
    this.recorder = record_lpcm16.record({
      sampleRate: 16000,
      channels: 1,
      endOnSilence: true,
      silence: `${SECONDS_BEFORE_END}.0`,
      threshold: 0,
      thresholdStart: 0,
      thresholdEnd: 0.5,
    });
    
    this.recorder.stream().pipe(bufferStream);
    
    bufferStream.on('finish', () => {
      this.recorder.stop();
      resolver.resolve(buffer);
    });

    bufferStream.on('error', (error) => {
      resolver.reject(error);
    })

    return resolver.promise;
  }

  stop() {
    if (this.recorder) this.recorder.stop();
  }

  clean() {
    if (this.recorder) this.recorder.stop();
  }
}

module.exports = {
  PromptDecectorService,
}