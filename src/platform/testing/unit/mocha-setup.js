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
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { setGlobalServer } from './msw-adapter';

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

  // Use dev.va.gov as the base URL to match production-like behavior
  // Use localhost as base URL - individual tests that need dev.va.gov
  // should mock window.location appropriately
  const baseUrl = 'http://localhost';

  // setup the document with proper structure for accessibility testing
  const dom = new JSDOM('<!doctype html><html lang="en"><head><title>Unit Test</title></head><body></body></html>', {
    url: baseUrl,
  });

  const { window } = dom;

  /* sets up `global` for testing */
  global.dom = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = { userAgent: 'node.js' };

  // Ensure DOM constructors are available globally for component libraries
  global.Element = window.Element;
  global.HTMLElement = window.HTMLElement;
  global.Node = window.Node;
  global.Event = window.Event;
  global.CustomEvent = window.CustomEvent;

  // Note: In JSDOM 22+ and Node 20+, crypto is already available on window
  // and global.crypto is a read-only getter. We don't need to polyfill it.

  // JSDOM 22+ has stricter EventTarget validation. React's development mode
  // uses invokeGuardedCallbackDev which calls addEventListener with a different
  // context (fake node). We need to patch addEventListener to handle this.
  const originalAddEventListener = window.addEventListener.bind(window);
  const originalRemoveEventListener = window.removeEventListener.bind(window);

  // eslint-disable-next-line func-names
  window.addEventListener = function(type, listener, options) {
    // If called on window (either directly or via .call), use the original
    try {
      return originalAddEventListener(type, listener, options);
    } catch (e) {
      // If JSDOM throws "not a valid instance of EventTarget", fall back silently
      // This happens in React dev mode's invokeGuardedCallbackDev
      if (e.message && e.message.includes('not a valid instance of EventTarget')) {
        return undefined;
      }
      throw e;
    }
  };

  // eslint-disable-next-line func-names
  window.removeEventListener = function(type, listener, options) {
    try {
      return originalRemoveEventListener(type, listener, options);
    } catch (e) {
      if (e.message && e.message.includes('not a valid instance of EventTarget')) {
        return undefined;
      }
      throw e;
    }
  };

  // Ensure requestAnimationFrame/cancelAnimationFrame are available globally.
  // JSDOM 22+ provides native implementations, but we ensure they're on global too.
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 0);
    };
  }
  if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
  // Also ensure they're on window for React to detect them
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = global.requestAnimationFrame;
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = global.cancelAnimationFrame;
  }

  global.Blob = window.Blob;

  // JSDOM doesn't implement URL.createObjectURL/revokeObjectURL
  // Add no-op implementations that can be stubbed by tests
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => '';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }

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

  // JSDOM doesn't implement window.open
  // Add no-op implementation that can be stubbed by tests
  if (!window.open) {
    window.open = () => null;
  }

  copyProps(window, global);

  // In JSDOM 22+, window.location is already properly configured.
  // Only attempt to redefine if the property is configurable.
  const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
  if (locationDescriptor && locationDescriptor.configurable) {
    Object.defineProperty(window, 'location', {
      value: window.location,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
}
/* eslint-disable no-console */

setupJSDom();
const checkAllowList = testContext => {
  const file = testContext.currentTest.file.slice(
    testContext.currentTest.file.indexOf('src'),
  );
  if (DISALLOWED_SPECS.indexOf(file) > -1 && file.includes('src')) {
    /* eslint-disable-next-line no-console */
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

// Global MSW server instance
// Tests should use the msw-adapter helpers to add handlers to this server
const mswServer = setupServer(
  http.get('/feature_toggles', () => {
    return new HttpResponse('', { status: 200 });
  }),
);

// Register the server with msw-adapter so tests can use it
setGlobalServer(mswServer);

export const mochaHooks = {
  beforeAll() {
    mswServer.listen({ onUnhandledRequest: 'bypass' });
  },

  beforeEach() {
    setupJSDom();
    resetFetch();
    cleanupStorage();
    if (isStressTest == 'false') {
      checkAllowList(this);
    }
    if (process.env.CI || ['trace', 'debug'].includes(process.env.LOG_LEVEL)) {
      console.log(
        'running: ',
        this.currentTest.file.slice(this.currentTest.file.indexOf('src')),
      );
    }
    // Note: We do NOT call resetHandlers() here because test suites may have
    // set up handlers in their before() hooks. Individual tests should manage
    // their own handler resets via server.resetHandlers() in afterEach().
  },

  afterEach() {
    cleanupStorage();
    flushPromises();
  },

  afterAll() {
    mswServer.close();
  }

};
