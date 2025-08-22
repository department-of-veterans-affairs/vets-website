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

  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const nodeFetchMaybe = require('node-fetch');
    const nodeFetchFn =
      (typeof nodeFetchMaybe === 'function' && nodeFetchMaybe) ||
      (nodeFetchMaybe && nodeFetchMaybe.default);

    if (typeof nodeFetchFn === 'function') {
      const wrappedNF = (...args) => {
        netTouched = true;
        return nodeFetchFn(...args);
      };

      try {
        const modId = require.resolve('node-fetch');
        if (require.cache[modId]) {
          const exp = require.cache[modId].exports;
          if (typeof exp === 'function') {
            require.cache[modId].exports = wrappedNF;
          } else if (exp && typeof exp === 'object') {
            exp.default = wrappedNF;
          }
        }
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    // ignore
  }

  const XHR = globalThis.XMLHttpRequest;
  if (XHR?.prototype?.open) {
    const origOpen = XHR.prototype.open;
    XHR.prototype.open = function patchedXHROpen(...args) {
      netTouched = true;
      return origOpen.apply(this, args);
    };
  }

  const n = globalThis.navigator;
  if (typeof n?.sendBeacon === 'function') {
    const origSB = n.sendBeacon.bind(n);
    n.sendBeacon = (...args) => {
      netTouched = true;
      return origSB(...args);
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
          line: 1,
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
