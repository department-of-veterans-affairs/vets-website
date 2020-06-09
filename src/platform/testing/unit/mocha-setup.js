/**
 * Global set up code for the Mocha unit testing environment
 *
 * If you're looking to add polyfills for all unit tests, this is the place.
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import '../../site-wide/moment-setup';
import ENVIRONMENTS from 'site/constants/environments';

const jsdom = require('jsdom');

// import sinon from 'sinon'

global.__BUILDTYPE__ = process.env.BUILDTYPE || ENVIRONMENTS.VAGOVDEV;
global.__API__ = null;
global.__MEGAMENU_CONFIG__ = null;

chai.use(chaiAsPromised);

/**
 * Sets up JSDom in the testing environment. Allows testing of DOM functions without a browser.
 */
export default function setupJSDom() {
  // if (global.document || global.window) {
  //   throw new Error('Refusing to override existing document and window.');
  // }

  // Prevent warnings from displaying
  /* eslint-disable no-console */
  console.error = () => {};
  console.warn = () => {};
  /* eslint-enable no-console */

  // setup the simplest document possible
  const dom = new jsdom.JSDOM('<!doctype html><html><body></body></html>');

  // get the window object out of the document
  const win = dom.window;

  global.dom = dom;
  global.document = win.document;
  global.window = win;
  global.navigator = {
    userAgent: 'node.js',
  };

  win.VetsGov = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  win.Forms = {
    scroll: {
      duration: 0,
      delay: 0,
      smooth: false,
    },
  };

  win.dataLayer = [];
  win.scrollTo = () => {};
  Object.defineProperty(win, 'sessionStorage', {
    value: global.sessionStorage,
    configurable: true,
    enumerable: true,
    writable: true,
  });
  Object.defineProperty(win, 'localStorage', {
    value: global.localStorage,
    configurable: true,
    enumerable: true,
    writable: true,
  });
  win.requestAnimationFrame = func => func();
  win.matchMedia = () => ({
    matches: false,
  });

  global.Blob = window.Blob;

  function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .reduce(
        (result, prop) => ({
          ...result,
          [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }),
        {},
      );
    Object.defineProperties(target, props);
  }

  copyProps(win, global);
}

setupJSDom();
