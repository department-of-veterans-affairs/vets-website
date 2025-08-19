const http = require('http');
const https = require('https');

let netTouched = false;
const warnedFiles = new Set();
let currentFile = null;

function makeNetWrappedFns(mod) {
  const origReq = mod.request && mod.request.bind(mod);
  const origGet = mod.get && mod.get.bind(mod);
  return {
    request(...args) {
      netTouched = true;
      return origReq(...args);
    },
    get(...args) {
      netTouched = true;
      return origGet(...args);
    },
  };
}

(function installWrappers() {
  const h = makeNetWrappedFns(http);
  if (h.request) http.request = h.request;
  if (h.get) http.get = h.get;

  const hs = makeNetWrappedFns(https);
  if (hs.request) https.request = hs.request;
  if (hs.get) https.get = hs.get;

  if (typeof globalThis.fetch === 'function') {
    const origFetch = globalThis.fetch.bind(globalThis);
    globalThis.fetch = (...args) => {
      netTouched = true;
      return origFetch(...args);
    };
  }
})();

module.exports = {
  mochaHooks: {
    beforeEach() {
      currentFile = (this.currentTest && this.currentTest.file) || currentFile;
    },
    afterEach() {
      if (netTouched && currentFile && !warnedFiles.has(currentFile)) {
        process.stdout.write(
          `::warning file=${currentFile},title=Unhandled network calls::` +
            `This spec made real network requests—add mocks (nock/msw) or stubs.\n`,
        );
        warnedFiles.add(currentFile);
      }
      netTouched = false;
    },
  },
};
