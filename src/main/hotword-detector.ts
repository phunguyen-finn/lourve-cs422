const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const path = require('path');
const fs = require('fs');

const porcupine = new Porcupine(
  'MEaIltGf8BE/QGcmDijwYn5cvC79ycSslXPX9lPkvkVEH+SUBSBHfQ==',
  [path.join(".", "model", "porcupine_model.ppn")],
  [0.65],
  path.join(".", "model", "porcupine_params_ja.pv")
);

const recorder = new PvRecorder(-1, porcupine.frameLength);

const startDetecting = async () => {
  recorder.start();

  while (true) {
    try {
      const frame = await recorder.read();
      const result = porcupine.process(frame);
      if (result !== -1) {
        process.stdout.write("y");
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const stopDetecting = () => {
  recorder.stop();
}

const exitDetecting = () => {
  recorder.stop();
  recorder.release();
  porcupine.release();
  process.exit();
}

process.stdin.on('data', (data) => {
  switch (data.toString()) {
    case 'r':
      startDetecting();
      break;
    case 'q':
      stopDetecting();
      break;
    case 'Q':
      exitDetecting();
      break;
    default:
      break;
  }
});