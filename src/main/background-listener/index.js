const { backgroundListenterController } = require("./startup");
const math = require('math');
const { isSilent } = require("./utils");

process.stdin.on('data', async (data) => {
  switch (data.toString()) {
    case 'start-hotword-detecting':
      try {
        await backgroundListenterController.startHotwordDetecting();
        process.stdout.write('hotword-detected');
      } catch (error) {
        process.stderr.write(JSON.stringify(error));
      } finally {
        break;
      }
    case 'stop-hotword-detecting':
      backgroundListenterController.stopHotwordDetecting();
      break;
    case 'start-prompt-detecting':
      try {
        const buffer = await backgroundListenterController.startPromptDetecting();
        if (isSilent(buffer)) {
          process.stdout.write('silent-prompt-detected');
        } else {
          process.stdout.write(Uint8Array.from(buffer));
        }
      } catch (error) {
        process.stderr.write(JSON.stringify(error));
      } finally {
        break;
      }
    case 'stop-prompt-detecting':
      backgroundListenterController.stopPromptDetecting();
      break;
    case 'exit':
      backgroundListenterController.clean();
      process.exit(0);
    default:
      process.stdout.write(`Unknown command: ${data.toString()}`);
      break;
  }
});