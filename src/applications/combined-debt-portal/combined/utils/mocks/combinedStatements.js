const mockCopays = require('./mockCopays.json');
const mockDebts = require('./mockDebts.json');

const happyPath = {
  data: { mockCopays, mockDebts },
};

module.exports = { happyPath };
