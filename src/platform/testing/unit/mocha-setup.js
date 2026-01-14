/**
 * Global set up code for the Mocha unit testing environment
 *
 * If you're looking to add polyfills for all unit tests, this is the place.
 */

// Some libraries (like web-vitals) call addEventListener at module load time,
// before JSDOM is set up. Provide no-op stubs that get replaced in setupJSDom.
if (typeof global.addEventListener === 'undefined') {
  global.addEventListener = () => {};
  global.removeEventListener = () => {};
}

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
import { rest } from 'msw';

// Polyfill Request.prototype.arrayBuffer for MSW v1 compatibility with node-fetch
// node-fetch v2 doesn't implement arrayBuffer() on Request
// NOTE: Only apply polyfill if Request exists (from isomorphic-fetch)
if (
  typeof global.Request !== 'undefined' &&
  global.Request.prototype &&
  !global.Request.prototype.arrayBuffer
) {
  Object.defineProperty(global.Request.prototype, 'arrayBuffer', {
    value: async function arrayBuffer() {
      const body = this.body;
      if (!body) return new ArrayBuffer(0);
      // Handle string body
      if (typeof body === 'string') {
        const buffer = Buffer.from(body);
        return buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );
      }
      // Handle stream body - need to collect chunks
      const chunks = [];
      // eslint-disable-next-line no-restricted-syntax
      for await (const chunk of body) {
        if (typeof chunk === 'string') {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk);
        }
      }
      const buffer = Buffer.concat(chunks);
      return buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      );
    },
    writable: true,
    configurable: true,
  });
}

const isStressTest = process.env.IS_STRESS_TEST || 'false';
const DISALLOWED_SPECS = process.env.DISALLOWED_TESTS || [];

// Module-scoped reference to the current JSDOM window.
// Updated each time setupJSDom() is called.
// The global.window getter references this so it always returns the current window.
let currentRealWindow = null;
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

  // Update the module-scoped reference to the current window.
  // The global.window getter (defined once below) references this.
  currentRealWindow = window;

  /* sets up `global` for testing */
  global.dom = dom;
  // Note: We set global.window directly first, then define getter/setter below.
  // On subsequent calls, the getter will return currentRealWindow (updated above).
  // Note: global.document is defined as a getter below to ensure modules
  // like axe-core always use the current window's document after beforeEach
  // creates a new JSDOM. See the Object.defineProperty for 'document' below.
  global.navigator = { userAgent: 'node.js' };
  global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 0);
  };
  global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
  global.Blob = window.Blob;

  /* Overwrites JSDOM global defaults from read-only to configurable */
  // Define the window getter/setter only once (first call).
  // It references currentRealWindow which is updated on each setupJSDom call.
  if (!Object.getOwnPropertyDescriptor(global, 'window')?.get) {
    Object.defineProperty(global, 'window', {
      get: () => currentRealWindow,
      set: newWindow => {
        // When tests try to replace window with Object.create(window),
        // instead copy the new properties to the real window.
        // This preserves EventTarget functionality in jsdom 16+.
        if (newWindow && newWindow !== currentRealWindow) {
          // If it's a plain object or Object.create result, copy its own properties
          const ownProps = Object.getOwnPropertyNames(newWindow);
          for (const prop of ownProps) {
            // Skip inherited Window properties, only copy test-added properties
            if (
              !Object.prototype.hasOwnProperty.call(
                Object.getPrototypeOf(currentRealWindow) || {},
                prop,
              )
            ) {
              try {
                const descriptor = Object.getOwnPropertyDescriptor(newWindow, prop);
                if (descriptor) {
                  Object.defineProperty(currentRealWindow, prop, descriptor);
                }
              } catch (e) {
                // Some properties may not be configurable, ignore
              }
            }
          }
        }
        // Don't actually replace window - always return currentRealWindow via getter
      },
      configurable: true,
      enumerable: true,
    });
  }

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
  window.scroll = () => {};
  window.scrollTo = () => {};
  window.VetsGov = { scroll };
  window.Forms = { scroll };
  window.getSelection = () => '';
  window.Mocha = true;

  copyProps(window, global);

  // jsdom 16+ creates separate constructor instances per window.
  // Define HTMLElement as a getter so tests always get the current window's version.
  // This fixes tests that capture HTMLElement.prototype at describe-block time.
  Object.defineProperty(global, 'HTMLElement', {
    get: () => global.window.HTMLElement,
    configurable: true,
    enumerable: true,
  });

  // HTMLAnchorElement must also be a getter for tests that stub click() on the prototype.
  Object.defineProperty(global, 'HTMLAnchorElement', {
    get: () => global.window.HTMLAnchorElement,
    configurable: true,
    enumerable: true,
  });

  // Element must also be a getter for the same reason - React component library
  // bindings use `instanceof Element` checks that fail if Element is stale.
  Object.defineProperty(global, 'Element', {
    get: () => global.window.Element,
    configurable: true,
    enumerable: true,
  });

  // jsdom 16+ also requires document to be a getter so that modules like
  // axe-core that capture document at import time will use the current
  // window's document after beforeEach creates a new JSDOM.
  // We use a backing variable to allow tests to temporarily override document.
  let documentOverride = null;
  Object.defineProperty(global, 'document', {
    get: () => documentOverride || global.window.document,
    set: val => {
      documentOverride = val;
    },
    configurable: true,
    enumerable: true,
  });

  // jsdom 16+ makes window.location a getter-only property on the prototype.
  // Delete it first, then redefine as a writable data property.
  // Use currentRealWindow directly since global.window getter returns it.
  const currentLocation = currentRealWindow.location;
  delete currentRealWindow.location;
  Object.defineProperty(currentRealWindow, 'location', {
    value: currentLocation,
    configurable: true,
    enumerable: true,
    writable: true,
  });

  // jsdom 16+ made crypto read-only, but tests need to mock it
  delete currentRealWindow.crypto;
  Object.defineProperty(currentRealWindow, 'crypto', {
    value: window.crypto,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}
/* eslint-disable no-console */

setupJSDom();

// Patch VA component library's isCoveredByReact to return false for click events.
// This forces the React bindings to use syncEvent() for click handlers on web components,
// which is needed because React's synthetic event delegation doesn't work properly
// with web component shadow DOM in jsdom. Without this patch, onClick handlers on
// VaLinkAction, VaButton, etc. don't fire when using fireEvent.click() or .click().
try {
  // Clear any cached component library modules so we can patch before they're re-exported
  Object.keys(require.cache)
    .filter(k => k.includes('component-library'))
    .forEach(k => {
      delete require.cache[k];
    });

  // eslint-disable-next-line import/no-unresolved
  const attachPropsModule = require('@department-of-veterans-affairs/component-library/dist/react-bindings/react-component-lib/utils/attachProps');
  const originalIsCoveredByReact = attachPropsModule.isCoveredByReact;
  const patchedIsCoveredByReact = eventName => {
    // Return false for click events so syncEvent is used instead of React delegation
    if (eventName === 'click') {
      return false;
    }
    return originalIsCoveredByReact(eventName);
  };

  // Patch the attachProps module directly (this is a writable property)
  attachPropsModule.isCoveredByReact = patchedIsCoveredByReact;

  // Now require the utils module which will pick up the patched version via __exportStar
  // eslint-disable-next-line import/no-unresolved, no-unused-vars
  const utilsModule = require('@department-of-veterans-affairs/component-library/dist/react-bindings/react-component-lib/utils');
} catch (e) {
  // Component library not installed or path changed - silently ignore
}

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

const server = setupServer(
  rest.get('/feature_toggles', (req, res, ctx) => {
    return res(ctx.status(200), ctx.body(''));
  }),
);

// Export server and rest for tests that need to add custom handlers
export { server, rest };

export const mochaHooks = {
  beforeAll() {
    server.listen({ onUnhandledRequest: 'bypass' });
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
    server.resetHandlers();
  },

  afterEach() {
    cleanupStorage();
    flushPromises();
  },

  afterAll() {
    server.close();
  }

};
