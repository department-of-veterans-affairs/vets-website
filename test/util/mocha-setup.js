import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'jsdom';

global.__BUILDTYPE__ = process.env.BUILDTYPE || 'development';
global.__ALL_CLAIMS_ENABLED__ = (process.env.BUILDTYPE === 'development' || process.env.ALL_CLAIMS_ENABLED === 'true');
global.__SAMPLE_ENABLED__ = (process.env.SAMPLE_ENABLED === 'true');

chai.use(chaiAsPromised);

// Sets up JSDom in the testing environment. Allows testing of DOM functions without a browser.
function setupJSDom() {
  if (global.document || global.window) {
    throw new Error('Refusing to override existing document and window.');
  }

  // setup the simplest document possible
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  const win = doc.defaultView;

  global.document = doc;
  global.window = win;

  // from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
  function propagateToGlobal(window) {
    for (const key in window) {
      if (!window.hasOwnProperty(key)) continue;
      if (key in global) continue;

      global[key] = window[key];
    }
  }

  propagateToGlobal(win);
}

setupJSDom();
