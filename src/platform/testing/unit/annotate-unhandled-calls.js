const http = require('http');
const https = require('https');

let netTouched = false;
const warnedFiles = new Set();

function makeNetWrappedFns(mod) {
  const origReq = mod.request.bind(mod);
  const origGet = mod.get.bind(mod);
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

(() => {
  const h = makeNetWrappedFns(http);
  http.request = h.request;
  http.get = h.get;

  const hs = makeNetWrappedFns(https);
  https.request = hs.request;
  https.get = hs.get;

  // Might need this for node 18+
  //   if (typeof globalThis.fetch === 'function') {
  //     const origFetch = globalThis.fetch.bind(globalThis);
  //     globalThis.fetch = (...args) => {
  //       netTouched = true;
  //       return origFetch(...args);
  //     };
  //   }
})();

beforeEach(function() {
  if (this.currentTest && this.currentTest.file)
    this._currentFile = this.currentTest.file;
});

afterEach(function() {
  if (netTouched && this._currentFile && !warnedFiles.has(this._currentFile)) {
    process.stdout.write(
      `::warning file=${this._currentFile},title=Unhandled network calls::` +
        `This spec made real network requests. Add mocks (nock/msw) or stubs.\n`,
    );
    warnedFiles.add(this._currentFile);
  }
  netTouched = false;
});
