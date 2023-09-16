/**
 * Global set up code for the Mocha unit testing environment
 *
 * If you're looking to add polyfills for all unit tests, this is the place.
 */
/* eslint-disable no-console */

import os from 'os';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';
import { JSDOM } from 'jsdom';
import '../../site-wide/moment-setup';
import ENVIRONMENTS from 'site/constants/environments';
import * as Sentry from '@sentry/browser';
import { configure } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';
import chaiAxe from './axe-plugin';
import { sentryTransport } from './sentry';

const ALLOW_LIST = JSON.parse(
  fs.readFileSync(path.resolve(`unit_test_allow_list.json`)),
);
const DISALLOWED_SPECS = ALLOW_LIST.filter(spec => spec.allowed === false).map(
  spec => spec.spec_path.substring(spec.spec_path.indexOf('src')),
);
// const TESTS_TO_STRESS_TEST = [];
const CHANGED_FILE_PATHS = process.env.CHANGED_FILE_PATHS
  ? process.env.CHANGED_FILE_PATHS.split(' ')
  : [];

const TESTS_TO_STRESS_TEST = DISALLOWED_SPECS.filter(specPath =>
  CHANGED_FILE_PATHS.some(filePath => specPath.includes(filePath)),
);
console.log('tests to stress test: ', TESTS_TO_STRESS_TEST);
console.log('changed file paths: ', CHANGED_FILE_PATHS);
console.log('disallowed specs: ', DISALLOWED_SPECS);
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

  window.getSelection = () => '';

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
/* eslint-disable no-console */

setupJSDom();
const checkAllowList = testContext => {
  console.log(
    'filepath: ',
    testContext.currentTest.file.substring(
      testContext.currentTest.file.indexOf('src'),
    ),
  );
  const file = testContext.currentTest.file.indexOf('src');
  if (DISALLOWED_SPECS.indexOf(file) > -1) {
    console.log('skipping test: ');
    testContext.skip();
  }
};
// This needs to be after JSDom has been setup, otherwise
// axe has strange issues with globals not being set up
chai.use(chaiAxe);

export const mochaHooks = {
  beforeEach() {
    setupJSDom();
    resetFetch();
    checkAllowList(this);
  },
  afterEach() {
    localStorage.clear();
  },
};
