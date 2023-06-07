const { SECONDS_BEFORE_END } = require("../constant");

const isSilent = (buffer) => {
  const duration = buffer.length / 16000;
  return duration <= SECONDS_BEFORE_END;
};

module.exports = {
  isSilent,
};
