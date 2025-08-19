const http = require('http');
const https = require('https');
const path = require('path');

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

function ghAnnotate({ file, title, message, line = 1 }) {
  const esc = s =>
    String(s)
      .replace(/%/g, '%25')
      .replace(/\r/g, '%0D')
      .replace(/\n/g, '%0A');
  process.stdout.write(
    `::warning file=${esc(file)},line=${line},title=${esc(title)}::${esc(
      message,
    )}\n`,
  );
}

module.exports = {
  mochaHooks: {
    beforeEach() {
      currentFile = (this.currentTest && this.currentTest.file) || currentFile;
    },
    afterEach() {
      if (netTouched && currentFile && !warnedFiles.has(currentFile)) {
        const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
        const rel = path.relative(workspace, currentFile).replace(/\\/g, '/');

        ghAnnotate({
          file: rel,
          line: 1, // pin to first line so it shows inline in PR diff
          title: 'Unhandled network calls',
          message:
            'This spec made real network requests. Add mocks (nock/msw) or stubs.',
        });

        warnedFiles.add(currentFile);
      }
      netTouched = false;
    },
  },
};
