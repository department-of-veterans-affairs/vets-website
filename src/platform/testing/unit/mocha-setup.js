/**
 * Global set up code for the Mocha unit testing environment
 *
 * If you're looking to add polyfills for all unit tests, this is the place.
 */

import os from 'os';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';
import { JSDOM } from 'jsdom';
import '../../site-wide/moment-setup';
import ENVIRONMENTS from 'site/constants/environments';
import * as Sentry from '@sentry/browser';

import { sentryTransport } from './sentry';

Sentry.init({
  dsn: 'http://one@fake/dsn',
  transport: sentryTransport,
});

global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
global.__API__ = null;
global.__MEGAMENU_CONFIG__ = null;

chai.use(chaiAsPromised);
chai.use(chaiDOM);

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

function filterStackTrace(trace) {
  return trace
    .split(os.EOL)
    .filter(line => !line.includes('node_modules'))
    .join(os.EOL);
}

/**
 * Sets up JSDom in the testing environment. Allows testing of DOM functions without a browser.
 */
function setupJSDom() {
  // if (global.document || global.window) {
  //   throw new Error('Refusing to override existing document and window.');
  // }

  // Prevent warnings from displaying
  /* eslint-disable no-console */
  if (process.env.LOG_LEVEL === 'debug') {
    console.error = (error, reactError) => {
      if (reactError instanceof Error) {
        console.log(filterStackTrace(reactError.stack));
      } else if (error instanceof Response) {
        console.log(`Error ${error.status}: ${error.url}`);
      } else if (error instanceof Error) {
        console.log(filterStackTrace(error.stack));
      } else if (error?.includes?.('The above error occurred')) {
        console.log(error);
      }
    };
    console.warn = () => {};
  } else if (process.env.LOG_LEVEL === 'log') {
    console.error = () => {};
    console.warn = () => {};
  }
  /* eslint-enable no-console */

  // setup the simplest document possible
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
  });

  const { window } = dom;

  global.dom = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = { userAgent: 'node.js' };

  global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 0);
  };

  global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };

  global.Blob = window.Blob;
  window.dataLayer = [];
  window.matchMedia = () => ({
    matches: false,
    addListener: f => f,
    removeListener: f => f,
  });
  window.scrollTo = () => {};

  window.VetsGov = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  window.Forms = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  window.Mocha = true;

  copyProps(window, global);

  // The following properties provided by JSDom are read-only by default.
  // Some tests rely on modifying them, so set them to writable to enable that.

  Object.defineProperty(global, 'window', {
    value: global.window,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty(global, 'sessionStorage', {
    value: window.sessionStorage,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty(global, 'localStorage', {
    value: window.localStorage,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  Object.defineProperty(window, 'location', {
    value: window.location,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

setupJSDom();

export const mochaHooks = {
  beforeEach() {
    setupJSDom();
  },
};
