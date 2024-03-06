/* eslint-disable no-console */
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
import { configure } from '@testing-library/dom';
import chaiAxe from './axe-plugin';
import { sentryTransport } from './sentry';

const isStressTest = process.env.IS_STRESS_TEST || 'false';
const DISALLOWED_SPECS = process.env.DISALLOWED_TESTS || [];
Sentry.init({
  autoSessionTracking: false,
  dsn: 'http://one@fake/dsn/0',
  transport: sentryTransport,
});

configure({ defaultHidden: true });

global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
global.__API__ = null;
global.__MEGAMENU_CONFIG__ = null;
global.__REGISTRY__ = [];

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

function resetFetch() {
  if (global.fetch.isSinonProxy) {
    global.fetch.restore();
  }
}

/**
 * Sets up JSDom in the testing environment. Allows testing of DOM functions without a browser.
 */
function setupJSDom() {
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

  /* sets up `global` for testing */
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

  /* Overwrites JSDOM global defaults from read-only to configurable */
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

  /* sets up `window` for testing */
  const scroll = { duration: 0, delay: 0, smooth: false };
  window.dataLayer = [];
  window.matchMedia = () => ({
    matches: false,
    addListener: f => f,
    removeListener: f => f,
  });
  window.scrollTo = () => {};
  window.VetsGov = { scroll };
  window.Forms = { scroll };
  window.getSelection = () => '';
  window.Mocha = true;

  copyProps(window, global);

  Object.defineProperty(window, 'location', {
    value: window.location,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

setupJSDom();
const checkAllowList = testContext => {
  const file = testContext.currentTest.file.slice(
    testContext.currentTest.file.indexOf('src'),
  );
  if (DISALLOWED_SPECS.indexOf(file) > -1 && file.includes('src')) {
    console.log('Test skipped due to flakiness: ', file);
    testContext.skip();
  }
};
// This needs to be after JSDom has been setup, otherwise
// axe has strange issues with globals not being set up
chai.use(chaiAxe);

const cleanupStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

export const mochaHooks = {
  beforeEach() {
    // ensure we dont run setupJSDom for /scripts/ directory
    if (this.currentTest.file.includes('src')) {
      setupJSDom();
      resetFetch();
      cleanupStorage();
      if (isStressTest == 'false') {
        checkAllowList(this);
      }
    }
  },
  afterEach() {
    cleanupStorage();
    flushPromises();
  },
};
